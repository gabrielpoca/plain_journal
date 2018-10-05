import React from 'react';
import ReactDropzone from 'react-dropzone';
import styled from 'styled-components';

import placeholderImg from '../placeholder-image.jpg';

const Dropzone = styled(ReactDropzone)`
  background-position: center 30px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${props => props.cover});
  height: 300px;
  position: relative;
`;

const CoverPicker = props => {
  const onChange = files => {
    const file = files[0];
    props.onPreview(file.preview);
    const reader = new FileReader();

    reader.onload = readerEvent => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const max_width_size = 800;
        const max_height_size = 800;
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (height > max_height_size) {
            width *= max_height_size / height;
            height = max_height_size;
          }
        } else {
          if (width > max_width_size) {
            height *= max_width_size / width;
            width = max_width_size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        const resizedImage = canvas.toDataURL(file.type);

        props.onChange({ file: resizedImage, type: file.type });
      };

      image.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <Dropzone
      disabled={props.disabled}
      accept="image/*"
      multiple={false}
      capture={true}
      onDrop={onChange}
      cover={props.cover || props.coverPreview || placeholderImg}
    />
  );
};

export default CoverPicker;
