import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Typography, Button, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const privateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' }
]

const categoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" },
]

function UploadVideoPage(props) {
  const user = useSelector(state => state.user);

  const [videoTitle, setVideoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0)
  const [categories, setCategories] = useState("Film & Animation")
  const [filePath, setFilePath] = useState("")
  const [duration, setDuration] = useState("")
  const [thumbnailPath, setThumbnailPath] = useState("")

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value)
  }

  const onPrivacyChange = (e) => {
    setPrivacy(e.currentTarget.value)
  }

  const onCategoryChange = (event) => {
    setCategories(event.currentTarget.value)
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: videoTitle,
      description: description,
      privacy: privacy,
      filePath: filePath,
      category: categories,
      duration: duration,
      thumbnail: thumbnailPath
    }

    axios.post('/api/video/uploadVideo', variables)
      .then(response => {
        if (response.data.success) {
          alert('video Uploaded Successfully')
          props.history.push('/')
        } else {
          alert('Failed to upload video')
        }
      })
  }

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    console.log(files)
    formData.append("file", files[0])

    // 업로드 한 뒤 서버에 보낸다. 
    axios.post('/api/video/uploadfiles', formData, config)
      .then(response => {
        if (response.data.success) {
          let variable = {
              filePath: response.data.filePath,
              fileName: response.data.fileName
          }
          setFilePath(response.data.filePath)

          // 썸네일 생성
          axios.post('/api/video/thumbnail', variable)
            .then(response => {
              if (response.data.success) {
                setDuration(response.data.fileDuration)
                setThumbnailPath(response.data.thumbsFilePath)
              } else {
                alert('Failed to make the thumbnails');
              }
          })
        } else {
          alert('failed to save the video in server')
        }
      })
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2} > Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone
            onDrop={onDrop}
            multiple={false}
            maxSize={800000000}>
              {({ getRootProps, getInputProps }) => (
                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <PlusOutlined style={{ fontSize: '3rem' }} />
                </div>
              )}
          </Dropzone>

          {thumbnailPath &&
            <div>
              <img src={`http://localhost:5000/${thumbnailPath}`} alt="haha" />
            </div>
          }
        </div>
        <br /><br />

        <label>Title</label>
        <Input
            onChange={onTitleChange}
            value={videoTitle}
        />
        <br /><br />

        <label>Description</label>
        <TextArea
          onChange={onDescriptionChange}
          value={description}
        />
        <br /><br />

        <select onChange={onPrivacyChange}>
          {privateOptions.map((item, index) => (
            <option key={`${index}${item.label}`} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br /><br />

        <select onChange={onCategoryChange}>
          {categoryOptions.map((item, index) => (
            <option key={`${index}${item.label}`} value={item.label}>{item.label}</option>
          ))}
        </select>
        <br /><br />

        <Button type="primary" size="large" onClick={onSubmit}>Submit</Button>
      </Form>
    </div>
  )
}

export default withRouter(UploadVideoPage);


