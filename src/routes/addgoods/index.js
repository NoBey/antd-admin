import React from 'react';
import {connect} from 'react-redux'
import {
    Button,
    Icon,
    Table,
    Modal,
    Input,
    Select,
    Form
} from 'antd'
const FormItem = Form.Item
import ReactQuill from 'react-quill'

// import { selecttab } from '../actions/app'
// import Appcomponents from '../components/App'
const {Column, ColumnGroup} = Table;
import axios from 'axios'

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}
const Option = Select.Option;

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
        type: '',
        price: '',
        state: '',
        space: '',
        show: false,
        maplist:[],
        mapname:'',
        content:'',
        spaceitemData: [],
        columns: [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                render: text => <a href="#">{text}</a>
            }, {
                title: '商品类型',
                key: 'type',
                render: (data) => ({room: '房间', booth: '卡座', chest: '柜子'}[data.type])
            }, {
                title: '价格',
                dataIndex: 'price',
                key: 'price'
            }, {
                title: '状态',
                key: 'state',
                render: (data) => (data.state.rent ?  '已购买' : '空闲')
            },{
                title: '剩余天数',
                key: 'day',
                render: (data) => (data.state.day ?  data.state.day : 0)
            }, {
                title: '操作',
                key: 'action',
                render: (data) => (
                    <div>
                        <Button onClick={() => this.open.bind(this)(data)}>编辑</Button>
                        <Button type="danger">删除</Button>
                    </div>
                )
            }
        ]
    }

    componentWillMount() {
        axios.get('/admin/api/space/').then((d) => {
            const tmp = d.data.map(a => (a.name))
            tmp.push('一号空间')
            this.setState({maplist: tmp})
        })
    }

    handleClick = (e) => {
        console.log('click ', e);
    }
    handleOk() {
        const {name, type, price, state, key, mapname,space, content } = this.state
        const data = {
            name,
            type,
            price,
            state,
            key,
            space,
            content
        }
          if(key){
            // 编辑
            axios.put('/admin/api/spaceitem/' + key, data).then(a => console.log(a))
          }
          else{
            // 新建
            data['space'] = mapname
            axios.post('/admin/api/spaceitem', data).then(a => console.log(a))

          }
        console.log(data)
        this.setState({show: false})
        this.setState({name: '', type: '', price: '', state: '', key: '',space:'',content:''})

        axios.get('/admin/api/spaceitem?all=true&space=' + mapname).then((d) => {
            const tmp = d.data.map(a => ({
              key: a._id,
              name: a.name,
              type: a.type,
              price: a.price,
              state:  a.state,
              space: a.space
            }))
            this.setState({spaceitemData: tmp})
        })

    }
    handleCancel() {
        this.setState({show: false})
        this.setState({name: '', type: '', price: '', state: '', key: '',space:'',content:''})

    }
    SelectChange(value){
      this.setState({mapname: value})

      axios.get('/admin/api/spaceitem?all=true&space=' + value).then((d) => {
          const tmp = d.data.map(a => ({
            key: a._id,
            name: a.name,
            type: a.type,
            price: a.price,
            state:  a.state,
            space: a.space,
            content:a.content
          }))
          this.setState({spaceitemData: tmp})
      })



    }
    open(data) {
        if (data.key) {
            this.setState({title: '编辑'})
            this.setState(data)
        } else {
            this.setState({title: '添加'})
            this.setState({name: '', type: '', price: '', state: '', key: '',space:'',content:''})
        }
        this.setState({show: true})
    }
    render() {
        const {
            show,
            columns,
            title,
            name,
            type,
            price,
            state,
            space,
            content,
            maplist,
            mapname,
            spaceitemData
        } = this.state
        return (
            <div style={{
                background: '#fff'
            }}>
                <Select defaultValue={'请选择领办地点'} style={{
                    width: 120
                }} onChange={this.SelectChange.bind(this)}>
                {maplist.map((a)=><Option key={a} value={a}>{a}</Option>)}
                </Select>


                    <Button type="primary" disabled={mapname===''} onClick={this.open.bind(this)}>添加商品</Button>


                <Table columns={columns} dataSource={spaceitemData}/>
                <Modal title={title} visible={show} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)} width={'60%'}>

                  <FormItem  label="商品名字" {...formItemLayout}>
                    <Input style={{
                        width: '100%'
                    }} value={name} onChange={({target}) => this.setState({name: target.value})} />
                  </FormItem>
                  <FormItem  label="空间" {...formItemLayout}>
                    <Select defaultValue={space} style={{
                        width: '100%'
                    }} onChange={(space)=> this.setState({space})}>

                    {maplist.map((a)=><Option key={a} value={a}>{a}</Option>)}

                    </Select>
                  </FormItem>
                  <FormItem  label="类型" {...formItemLayout}>
                    <Select defaultValue={type} style={{
                        width: '100%'
                    }} onChange={(v)=> this.setState({type: v})}>
                    <Option value={'room'}>{'房间'}</Option>
                    <Option value={'booth'}>{'卡座'}</Option>
                    <Option value={'chest'}>{'柜子'}</Option>
                    </Select>
                  </FormItem>

                  <FormItem  label="价格" {...formItemLayout}>
                    <Input style={{
                        width: '100%'
                    }} value={price} onChange={({target}) => this.setState({price: target.value})}/>
                  </FormItem>

                  <FormItem  label="天数" {...formItemLayout}>
                    <Input style={{
                        width: '100%'
                    }} value={state.day} onChange={({target}) => this.setState({state: {day:target.value}})} />
                  </FormItem>
                  <FormItem  label="状态" {...formItemLayout}>
                    <Select defaultValue={state.rent} style={{
                        width: '100%'
                    }} onChange={(rent)=> this.setState({state:{rent}})}>
                    <Option value={false}>{'空闲-可购买'}</Option>
                    <Option value={true}>{'已购买-不可购买'}</Option>
                    </Select>
                  </FormItem>

                  <FormItem  label="简介" {...formItemLayout}>
                    <ReactQuill modules={Infomodules}  value={content} onChange={(content)=>{
                        this.setState({content})
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
