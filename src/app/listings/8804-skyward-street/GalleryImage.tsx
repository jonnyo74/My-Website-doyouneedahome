'use client'

import Image from 'next/image'
import { openLightbox } from './lightboxBus'
import { PHOTOS, type SkywardPhoto } from './photos'

/**
 * One clickable frame in the gallery. `index` is the photo's position in the
 * full 46-photo sequence, which is also its lightbox position. Full-width
 * frames render at the photo's native ratio; frames sharing a row pass `crop`
 * (an aspect-* class) so the row lines up — the lightbox always shows the
 * uncropped file.
 */
export default function GalleryImage({
  photo,
  index,
  sizes,
  crop,
  priority = false,
}: {
  photo: SkywardPhoto
  index: number
  /** next/image sizes attr — matches the grid slot this frame renders in. */
  sizes: string
  /** Tailwind aspect-* class; when set the image cover-crops to fill it. */
  crop?: string
  priority?: boolean
}) {
  return (
    <button
      type="button"
      className={`sky-frame ${crop ?? ''}`}
      onClick={() => openLightbox(index)}
      aria-label={`View photo ${index + 1} of ${PHOTOS.length} full-size: ${photo.alt}`}
    >
      {crop ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          quality={75}
          className="object-cover"
        />
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          quality={75}
        />
      )}
    </button>
  )
}
