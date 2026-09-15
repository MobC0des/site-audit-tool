export function checkImageAlt(images) {
  const imagesWithoutAlt = images.filter(
    (image) => image.alt === null,
  );

  const imagesWithEmptyAlt = images.filter(
    (image) => image.alt === '',
  );

  if (imagesWithoutAlt.length > 0) {
    return {
      id: 'image-alt',
      name: 'Image Alt',
      status: 'Failed',
      message: `${imagesWithoutAlt.length} image(s) are missing an alt attribute.`,
    };
  }

  if (imagesWithEmptyAlt.length > 0) {
    return {
      id: 'image-alt',
      name: 'Image Alt',
      status: 'Warning',
      message: `${imagesWithEmptyAlt.length} image(s) have empty alt text. Check that they are decorative.`,
    };
  }

  return {
    id: 'image-alt',
    name: 'Image Alt',
    status: 'Passed',
    message: 'All images have alt text.',
  };
}
