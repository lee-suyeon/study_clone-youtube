import React, { useState } from 'react'
import { Typography, Button, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const { TextArea } = Input;
const { Title } = Typography;

const privateOptions = [
  { value: 0, label : 'Private' },
  { value: 1, label : 'Public' },
];

const categoryOptions = [
  { value: 0, label : 'Film & Animation' },
  { value: 1, label : 'Autos & Vehicles' },
  { value: 2, label : 'Music' },
  { value: 3, label : 'Pets & Animals' },
];

function VideoUploadPage(props) {
  const user = useSelector(state => state.user);
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [category, setCategory] = useState('Film & Animation');
  const [filePath, setFilePath] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnailPath, setThumbnailPath] = useState('');

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  }
  
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  }

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: videoTitle,
      description: description,
      privacy: Private,
      filePath: filePath,
      category: category,
      duration: duration,
      thumbnail: thumbnailPath
  }

    Axios.post('/api/video/uploadVideo', variables)
      .then(response => {
        if(response.data.success){
          message.success('성공적으로 업로드를 했습니다');
          setTimeout(() => {
            props.history.push('/');
          }, 3000);
        } else {
          alert('비디오 업로드에 실패 했습니다');
        }
      })
  }

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])
    console.log(files); // 파일 정보 

    // 업로드 한뒤 서버에 보낸다. 
    Axios.post('/api/video/uploadfiles', formData, config)
      .then(response => {
        if(response.data.success){
          let variable = {
            url:response.data.filePath,
            fileName: response.data.fileName
          }
          setFilePath(response.data.filePath);
          Axios.post('/api/video/thumbnail', variable)
            .then(response => {
              if(response.data.success){
                setDuration(response.data.fileDuration);
                setThumbnailPath(response.data.thumbsFilePath);
              } else {
                alert('썸네일 생성에 실패했습니다.')
              }
            })
        } else {
          alert('비디오 업로드를 실패했습니다')
        }
      });
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          {/* Drop zone */}
          <Dropzone
            onDrop={onDrop}
            multiple={false}
            maxSize={10000000}>
            {({ getRootProps, getInputProps }) => (
              <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              {...getRootProps()}
              >
              <input {...getInputProps()} />
              <PlusOutlined style={{ fontSize: '3rem' }} />
              </div>
            )}
            
        </Dropzone>

          {/* Thumnail */}
          {thumbnailPath &&
          <div>
            <img src={`http://localhose:5000/${thumbnailPath}`} alt="thumbnail" />
          </div>
          }

          <div style={{ marginBottom: '3rem'}}>
            <label>Title</label>
            <Input 
              onChange={onTitleChange}
              value={videoTitle}
            />
          </div>

          <div style={{ marginBottom: '3rem'}}>
            <label>Description</label>
            <TextArea 
              onChange={onDescriptionChange}
              value={description}
            />
          </div>

          <select onChange={onPrivateChange} style={{ marginBottom: '3rem'}}>
            {privateOptions.map((item, index) => <option key={`${index}${item.label}`} value={item.value}>{item.label}</option>)}
          </select>

          <select onChange={onCategoryChange} style={{ marginBottom: '3rem'}}>
            {categoryOptions.map((item, index) => <option key={`${index}${item.label}`} value={item.value}>{item.label}</option>)}
          </select>

          <Button type="primary" size="large" onClick={onSubmit}>
            Submit
          </Button>

        </div>
      </Form>
    </div>
  )
}

export default VideoUploadPage
