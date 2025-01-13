import {Form, Upload} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";

//File Input Component
const InputFile = (props) => {
    let max = props.max || 1
    let name = props.name || 'img'
    let listType = props.listType || "picture-card"

    let [refresh, setRefresh] = useState()
    let reload = () => setRefresh(!refresh)

    useEffect(() => {
        reload()
    }, [])

    const fileList = () => {
        let values = props.form.getFieldsValue()
        if (values[name]) {
            return values[name]
        }
        return []
    }

    const onChange = ({fileList: newFileList}) => {
        let value = {}
        value[name] = newFileList
        props.form.setFieldsValue(value)
        reload()
    }

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = document.createElement("img");
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    return (


<div className="form-group">
    {props.label && (
      <label className="block mb-2 text-sm font-medium text-gray-700">{props.label}</label>
    )}
    <Form.Item  name={name}>
      <Upload
        accept="image/png, image/gif, image/jpeg"
        listType={listType}
        onPreview={onPreview}
        fileList={fileList()}
        onChange={onChange}
        maxCount={max}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-all flex"
        itemRender={(originNode, file, currFileList, actions) => (
          <div className="relative flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-md">
            <img
              src={file.thumbUrl || file.url}
              alt={file.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">Size: {file.size} KB</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPreview(file)}
                className="text-blue-500 hover:text-blue-700 transition"
              >
                Preview
              </button>
              <button
                onClick={() => actions.remove(file)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      >
        {fileList().length < max && (
          <div className="flex flex-col items-center justify-center text-blue-500 hover:text-blue-700 cursor-pointer p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all w-full ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-sm font-medium">Click to upload</p>
          </div>
        )}
      </Upload>
    </Form.Item>
</div>

  )
}

export default InputFile

export const uploadImage = async image => {
    try {
        const data = new FormData()
        data.append('image', image)
        let url = `https://api.imgbb.com/1/upload?key=${process.env.imgbb_key}`;
        const res = await axios.post(url, data, {})
        if (res.data.success) {
            console.log(res.data)
            return res.data.data.image.url
        }
    } catch (e) {
        return ''
    }
}

export const getUploadImageUrl = async image => {
    if (image?.length > 0) {
        if (image[0].uid === '-1') {
            return image[0].url
        } else {
            let {originFileObj} = image[0]
            return await uploadImage(originFileObj)
        }
    }
    return ''
}