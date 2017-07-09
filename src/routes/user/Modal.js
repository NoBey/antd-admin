import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item._id,
      }
      console.log(data)
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="职务" hasFeedback {...formItemLayout}>
          {getFieldDecorator('position', {
            initialValue: item.position,
            rules: [],
          })(<Input />)}
        </FormItem>

        <FormItem label="公司" hasFeedback {...formItemLayout}>
          {getFieldDecorator('company', {
            initialValue: item.company,
            rules: [],
          })(<Input />)}
        </FormItem>

        <FormItem label="手机" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phone', {
            initialValue: item.phone,
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: '必须是手机号!',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="微信" hasFeedback {...formItemLayout}>
          {getFieldDecorator('weixin', {
            initialValue: item.weixin,
            rules: [],
          })(<Input />)}
        </FormItem>

        <FormItem label="QQ" hasFeedback {...formItemLayout}>
          {getFieldDecorator('qq', {
            initialValue: item.qq,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="公司" hasFeedback {...formItemLayout}>
          {getFieldDecorator('company', {
            initialValue: item.company,
            rules: [],
          })(<Input />)}
        </FormItem>

        <FormItem label="E-mail" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              {
                required: true,
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: '必须是邮箱!',
              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
