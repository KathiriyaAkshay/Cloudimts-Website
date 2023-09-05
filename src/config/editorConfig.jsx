import Table from '@ckeditor/ckeditor5-table/src/table';
import Image from '@ckeditor/ckeditor5-image/src/image';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

export const editorConfig = {
  plugins: [Table, Image, MediaEmbed],
  toolbar: ['table', 'imageUpload', 'mediaEmbed'],
};