"""
Builds src/lib/abacoaMapData.generated.json from Palm Beach County GIS.

Run:  python scripts/build-abacoa-map-data.py
Needs: Python 3 and shapely (pip install shapely). Network access to gis.pbcgov.org.

What it does
  * Village outlines: every parcel the Property Appraiser files under a village's
    recorded subdivision (plat) name, dissolved into one outline. A plat is the
    legal boundary of a recorded subdivision, so this is the county's own geometry,
    not a drawing. Villages whose plats are not named for the village (Antigua,
    most of Newhaven) get no outline here and are shown as pins instead.
  * Street alignment: Palm Beach County Engineering road centerlines.
  * Pins: the county parcel at a published street address (POA directory, HOA
    sites), using the parcel's centroid.

Every feature carries the layer URL it came from and the query that produced it,
so it can be re-checked. Nothing is hand-drawn.
"""
import json
import math
import urllib.parse
import urllib.request
from datetime import date

from shapely.geometry import MultiPoint, Point, Polygon, mapping, shape
from shapely.ops import unary_union

PARCELS = 'https://gis.pbcgov.org/arcgis/rest/services/Parcels/PARCEL_INFO/MapServer/4'
CENTERLINE = 'https://gis.pbcgov.org/arcgis/rest/services/ENG/CENTERLINE/MapServer/0'
# Abacoa and its surroundings; keeps same-named plats elsewhere out.
BBOX = '-80.14,26.865,-80.07,26.925'
# Wider frame for the road lines so Indiantown Road and the Turnpike are included.
ROAD_BBOX = '-80.16,26.86,-80.06,26.945'
LAT0 = 26.89
KX = 111320 * math.cos(math.radians(LAT0))
KY = 110574


def to_m(lon, lat):
    return ((lon + 80.1) * KX, (lat - LAT0) * KY)


def to_ll(x, y):
    return (x / KX - 80.1, y / KY + LAT0)


def project(geom, fn):
    from shapely.ops import transform
    return transform(lambda x, y, z=None: fn(x, y), geom)


def fetch(layer, where, fields, geometry=True, bbox=BBOX, page=2000):
    out, offset = [], 0
    while True:
        p = {
            'where': where, 'outFields': fields, 'returnGeometry': 'true' if geometry else 'false',
            'outSR': '4326', 'f': 'json', 'geometry': bbox, 'geometryType': 'esriGeometryEnvelope',
            'inSR': '4326', 'spatialRel': 'esriSpatialRelIntersects',
            'resultOffset': str(offset), 'resultRecordCount': str(page),
        }
        with urllib.request.urlopen(layer + '/query?' + urllib.parse.urlencode(p), timeout=120) as r:
            d = json.load(r)
        if d.get('error'):
            raise RuntimeError(d['error'])
        feats = d.get('features', [])
        out += feats
        if not d.get('exceededTransferLimit') and len(feats) < page:
            break
        offset += page
    return out


def rings_to_geom(feats):
    polys = []
    for f in feats:
        g = f.get('geometry')
        if not g or 'rings' not in g:
            continue
        # Esri rings: outer rings clockwise. Treat each ring as a polygon and union; holes are small.
        for ring in g['rings']:
            if len(ring) >= 4:
                poly = Polygon([to_m(x, y) for x, y in ring])
                if poly.is_valid and poly.area > 0:
                    polys.append(poly)
                else:
                    polys.append(poly.buffer(0))
    return unary_union(polys)


def outline(feats, close_m=14.0, simplify_m=2.5):
    g = rings_to_geom(feats)
    # Close the gaps that street rights-of-way leave between blocks, then shave back.
    g = g.buffer(close_m).buffer(-close_m * 0.85)
    g = g.simplify(simplify_m)
    # Keep the largest pieces; drop slivers.
    parts = list(g.geoms) if g.geom_type == 'MultiPolygon' else [g]
    parts = [p for p in parts if p.area > 4000]
    parts = [Polygon(p.exterior) for p in parts]  # no holes: interior lakes are inside the village
    return unary_union(parts)


def to_geojson(geom):
    ll = project(geom, to_ll)
    m = mapping(ll)

    def rnd(c):
        return [round(c[0], 5), round(c[1], 5)]

    def walk(coords):
        if isinstance(coords[0], (float, int)):
            return rnd(coords)
        return [walk(c) for c in coords]
    return {'type': m['type'], 'coordinates': walk(m['coordinates'])}


VILLAGES = {
    # slug: (display name, [SUBDIV_NAME LIKE patterns])
    'mallory-creek': ('Mallory Creek', ['MALLORY CREEK AT ABACOA%']),
    'martinique': ('Martinique', ['MARTINIQUE AT ABACOA%']),
    'tuscany': ('Tuscany', ['TUSCANY AT ABACOA%']),
    'valencia': ('Valencia', ['VALENCIA AT ABACOA%']),
    'windsor-park': ('Windsor Park', ['WINDSOR PARK AT ABACOA%']),
    'charleston-court': ('Charleston Court', ['CHARLESTON COURT AT ABACOA%']),
    'canterbury-place': ('Canterbury Place', ['CANTERBURY PLACE%']),
    'osceola-woods': ('Osceola Woods', ['OSCEOLA WOODS%']),
    # Ownership communities with no guide on this site yet. Shown unlinked on the hub map for orientation.
    'somerset': ('Somerset', ['SOMERSET AT ABACOA%']),
    'cambridge': ('Cambridge', ['CAMBRIDGE AT ABACOA%']),
    'the-island': ('The Island at Abacoa', ['ISLAND AT ABACOA%']),
    'village-at-abacoa': ('The Village at Abacoa', ['VILLAGE AT ABACOA%']),
}

# Address pins: (id, label, kind, query on SITE_ADDR_STR, source note)
PINS = [
    ('roger-dean-stadium', 'Roger Dean Chevrolet Stadium', 'landmark', "SITE_ADDR_STR LIKE '4355 STADIUM DR%'", 'Palm Beach County parcel 4355 Stadium Dr (owner: Palm Beach County), the stadium complex; pin is the parcel centre, not the entrance'),
    ('abacoa-golf-club', 'Abacoa Golf Club', 'landmark', "SITE_ADDR_STR LIKE '105 BARBADOS DR%'", 'Club address per abacoa.com; pin is the parcel centre'),
    ('town-center', 'Downtown Abacoa / Town Center', 'landmark', "SITE_ADDR_STR LIKE '1200 TOWN CENTER DR%'", 'County parcel at 1200 Town Center Dr, the mixed-use block on Main Street; pin is the parcel centre'),
    ('newhaven-hoa-office', 'Newhaven HOA office', 'hoa', "SITE_ADDR_STR LIKE '112 NEWHAVEN BLVD%'", 'HOA office address per abacoa.com/neighborhoods/newhaven; county parcel owner is Newhaven at Abacoa HMO'),
    ('mallory-creek-clubhouse', 'Mallory Creek clubhouse', 'hoa', "SITE_ADDR_STR LIKE '1221 S JEAGA DR%'", 'Clubhouse address per mallorycreekhoa.com'),
    ('martinique-poa-address', 'Martinique (POA address)', 'hoa', "SITE_ADDR_STR LIKE '1812 DAKOTA DR%'", 'Address per abacoa.com/neighborhoods/martinique'),
    ('antigua-common-area', 'Antigua at Town Center (HOA-owned common area)', 'hoa', "OWNER_NAME1 LIKE 'ANTIGUA AT TOWN CENTER HOA%'", 'Largest county parcel owned by Antigua at Town Center HOA Inc (clubhouse and pool area per abacoa.com/neighborhoods/antigua-town-center); the village has no plat of its own, so it is shown as a pin'),
    ('dakota-at-abacoa', 'Dakota at Abacoa (rental community)', 'rental', "SUBDIV_NAME = 'DAKOTA'", 'County plat DAKOTA; leasing office is 3334 S. Bismark Lane per abacoa.com/neighborhoods/dakota-abacoa. Pin is the plat centre'),
]


def centroid_ll(feats):
    g = rings_to_geom(feats)
    c = g.representative_point()
    lon, lat = to_ll(c.x, c.y)
    return [round(lon, 5), round(lat, 5)]


def main():
    data = {
        'generated': date.today().isoformat(),
        'sources': {
            'parcels': PARCELS,
            'centerline': CENTERLINE,
        },
        'villages': {},
        'pins': {},
        'streets': {},
    }

    for slug, (name, pats) in VILLAGES.items():
        where = ' OR '.join("SUBDIV_NAME LIKE '%s'" % p for p in pats)
        feats = fetch(PARCELS, where, 'SUBDIV_NAME,ACRES')
        names = sorted({f['attributes']['SUBDIV_NAME'] for f in feats})
        g = outline(feats)
        acres = sum((f['attributes'].get('ACRES') or 0) for f in feats)
        c = g.representative_point()
        lon, lat = to_ll(c.x, c.y)
        data['villages'][slug] = {
            'name': name,
            'parcels': len(feats),
            'platNames': names,
            'parcelAcres': round(acres, 1),
            'outline': to_geojson(g),
            'label': [round(lon, 5), round(lat, 5)],
            'source': PARCELS,
            'where': where,
        }
        print(slug, len(feats), 'parcels', round(acres, 1), 'ac', 'parts', len(g.geoms) if g.geom_type == 'MultiPolygon' else 1)

    for pid, label, kind, where, note in PINS:
        feats = fetch(PARCELS, where, 'SITE_ADDR_STR,SUBDIV_NAME,ACRES')
        if pid == 'antigua-common-area':
            feats = sorted(feats, key=lambda f: -(f['attributes'].get('ACRES') or 0))
        if not feats:
            print('NO PARCEL FOR', pid)
            continue
        data['pins'][pid] = {
            'label': label, 'kind': kind, 'position': centroid_ll(feats if pid == 'dakota-at-abacoa' else feats[:1]),
            'address': feats[0]['attributes'].get('SITE_ADDR_STR'), 'subdivision': feats[0]['attributes'].get('SUBDIV_NAME'),
            'note': note, 'source': PARCELS, 'where': where,
        }
        print(pid, data['pins'][pid]['position'], data['pins'][pid]['address'])

    # Roads: county centerlines by street name, Abacoa area only.
    for key, where in {
        'dakota-drive': "UPPER(STREET) LIKE '%DAKOTA DR%'",
        'military-trail': "UPPER(STREET) LIKE '%MILITARY TRL%'",
        'indiantown-road': "UPPER(STREET) LIKE '%INDIANTOWN RD%'",
        'central-boulevard': "UPPER(STREET) LIKE '%CENTRAL BLVD%'",
        'frederick-small-road': "UPPER(STREET) LIKE '%FREDERICK SMALL RD%'",
        'indian-creek-parkway': "UPPER(STREET) LIKE '%INDIAN CREEK PKWY%'",
        'main-street': "UPPER(STREET) LIKE '%MAIN ST%'",
        'turnpike': "UPPER(STREET) LIKE '%TPKE%' OR UPPER(STREET) LIKE '%TURNPIKE%'",
    }.items():
        feats = fetch(CENTERLINE, where, 'STREET,L_MUNI,R_MUNI', bbox=ROAD_BBOX)
        lines = []
        for f in feats:
            for path in (f.get('geometry') or {}).get('paths', []):
                lines.append([[round(x, 5), round(y, 5)] for x, y in path])
        data['streets'][key] = {'segments': len(lines), 'lines': lines, 'where': where, 'source': CENTERLINE,
                                'streetNames': sorted({f['attributes']['STREET'] for f in feats})}
        print(key, len(lines), 'segments', data['streets'][key]['streetNames'][:4])

    with open('src/lib/abacoaMapData.generated.json', 'w', encoding='utf-8') as fh:
        json.dump(data, fh, separators=(',', ':'))
    print('wrote', 'src/lib/abacoaMapData.generated.json')


if __name__ == '__main__':
    main()
