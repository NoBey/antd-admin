import React from 'react';
import {connect} from 'react-redux'
import {Button, Icon, Table, Modal, Input} from 'antd'
// import { selecttab } from '../actions/app'
// import Appcomponents from '../components/App'
const {Column, ColumnGroup} = Table;
import axios from 'axios'


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
                key: 'info'
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
                <Modal title={title} visible={show} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                    <Input style={{
                        width: '100%'
                    }} value={name} onChange={({target}) => this.setState({name: target.value})} addonBefore={'领办地点名称'}/>
                    <Input style={{
                        width: '100%'
                    }} value={address} onChange={({target}) => this.setState({address: target.value})} addonBefore={'领办地址'}/>
                    <Input style={{
                        width: '100%'
                    }} value={x} onChange={({target}) => this.setState({x: target.value})} addonBefore={'领办纬度'}/>
                    <Input style={{
                        width: '100%'
                    }} value={y} onChange={({target}) => this.setState({y: target.value})} addonBefore={'领办经度'}/>
                    <Input type="textarea" value={info} onChange={({target}) => this.setState({info: target.value})} style={{
                        width: '100%'
                    }} placeholder={'领办简介'}/>
                </Modal>
            </div>
        )
    }
}


export default Container
