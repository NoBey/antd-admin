import React from 'react';
import {connect} from 'react-redux'
import {Button, Icon, Table, Modal, Input, Form} from 'antd'
// import { selecttab } from '../actions/app'
// import Appcomponents from '../components/App'
import ReactQuill from 'react-quill'
const {Column, ColumnGroup} = Table;
import axios from 'axios'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}
const Infomodules = {
  toolbar: [
    ['image'],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'align': [] }],
  ['clean']                                         // remove formatting button
]
}
class Container extends React.Component {
    state = {
        title: '',
        name: '',
        address: '',
        info: '',
        x: '',
        y: '',
        show: false,
        columns: [
            {
                title: '领办地点名称',
                dataIndex: 'name',
                key: 'name',
                render: text => <a href="#">{text}</a>
            }, {
                title: '领办地址',
                dataIndex: 'address',
                key: 'address'
            }, {
                title: '领办简介',
                dataIndex: 'info',
                key: 'info',
                render: (data) => (
                  <span style={{width: '100px',display: 'block', height: '20px'}}>{data}</span>
                )
            }, {
                title: '领办纬度',
                dataIndex: 'x',
                key: 'x'
            }, {
                title: '领办经度',
                dataIndex: 'y',
                key: 'y'
            }, {
                title: '操作',
                key: 'action',
                render: (data) => (
                    <div>
                        <Button onClick={() => this.open.bind(this)(data)}>编辑</Button>
                        <Button onClick={() => this.del.bind(this)(data)} type="danger">删除</Button>
                    </div>
                )
            }
        ],
        spacedata: []
    }

    componentWillMount() {
        axios.get('/admin/api/space/').then((d) => {
            const tmp = d.data.map(a => ({
                key: a._id,
                name: a.name,
                address: a.address,
                info: a.info,
                x: a.x,
                y: a.y
            }))
            this.setState({spacedata: tmp})
        })
    }
    handleClick = (e) => {
        console.log('click ', e);
    }
    handleOk() {
        const {name, address, info, x, y, key} = this.state
        const data = {
            name,
            address,
            info,
            x,
            y,
            key
        }
        if(key){
          axios.put('/admin/api/space/' + key, data).then((a)=>{
            console.log(a)
          })
        }else{
          axios.post('/admin/api/space/', data).then((a)=>{
            console.log(a)
          })
        }

        axios.get('/admin/api/space/').then((d) => {
            const tmp = d.data.map(a => ({
                key: a._id,
                name: a.name,
                address: a.address,
                info: a.info,
                x: a.x,
                y: a.y
            }))
            this.setState({spacedata: tmp})
        })

        console.log(data)
        this.setState({show: false})
        this.setState({name: '', address: '', info: '', x: '', y: '',key: ''})

    }
    handleCancel() {
        this.setState({show: false})
        this.setState({name: '', address: '', info: '', x: '', y: '',key: ''})

    }
    open(data) {
        if (data.key) {
            this.setState({title: '编辑'})
            this.setState(data)
        } else {
            this.setState({title: '添加'})
            this.setState({name: '', address: '', info: '', x: '', y: '',key: ''})
        }
        this.setState({show: true})
    }
    del(data){
      axios.delete('/admin/api/space/'+ data.key).then((d) => console.log(d))
      axios.get('/admin/api/space/').then((d) => {
          const tmp = d.data.map(a => ({
              key: a._id,
              name: a.name,
              address: a.address,
              info: a.info,
              x: a.x,
              y: a.y
          }))
          this.setState({spacedata: tmp})
      })
    }
    render() {
        const {
            show,
            columns,
            title,
            name,
            address,
            info,
            x,
            y,
            spacedata
        } = this.state
        return (
            <div style={{
                background: '#fff',
                padding: '20px'
            }}>
                <Button type="primary" onClick={this.open.bind(this)}>添加</Button>
                <Table columns={columns} dataSource={spacedata}/>
                <Modal title={title} visible={show} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)} width={'60%'}>
                  <FormItem  label="领办地点名称" {...formItemLayout}>
                    <Input style={{
                        width: '100%'
                    }} value={name} onChange={({target}) => this.setState({name: target.value})} />
                  </FormItem>
                    <FormItem  label="领办地址" {...formItemLayout}>
                      <Input style={{
                          width: '100%'
                      }} value={address} onChange={({target}) => this.setState({address: target.value})} />
                    </FormItem>

                    <FormItem  label="领办纬度" {...formItemLayout}>
                      <Input style={{
                          width: '100%'
                      }} value={x} onChange={({target}) => this.setState({x: target.value})} />
                    </FormItem>
                    <FormItem  label="领办经度" {...formItemLayout}>
                      <Input style={{
                          width: '100%'
                      }} value={y} onChange={({target}) => this.setState({y: target.value})} />
                    </FormItem>
                    <FormItem  label="领办简介" {...formItemLayout}>
                      <ReactQuill modules={Infomodules}  value={info} onChange={(v)=>{
                          console.log(v)
                          this.setState({info: v})
                        }} >
                        <div style={{minHeight:'400px'}}>

                        </div>
                      </ReactQuill>
                    </FormItem>


                </Modal>
            </div>
        )
    }
}


export default Container
