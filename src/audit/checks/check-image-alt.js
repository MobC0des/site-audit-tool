export function checkImageAlt(images) {
  const imagesWithoutAlt = images.filter((image) => {
    return image.alt === null;
  });

  if (imagesWithoutAlt.length > 0) {
    return {
      id: 'image-alt',
      name: 'Image Alt',
      status: 'Failed',
      message: `Image ${imagesWithoutAlt[0].src} is missing an alt attribute.`,
    };
  } else {
    return {
      id: 'image-alt',
      name: 'Image Alt',
      status: 'Passed',
      message: 'All images have alt attributes.',
    };
  }
}
