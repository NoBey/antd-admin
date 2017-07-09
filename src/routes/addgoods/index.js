import React from 'react';
import {connect} from 'react-redux'
import {
    Button,
    Icon,
    Table,
    Modal,
    Input,
    Select
} from 'antd'
// import { selecttab } from '../actions/app'
// import Appcomponents from '../components/App'
const {Column, ColumnGroup} = Table;
import axios from 'axios'


const Option = Select.Option;
const data = [
    {
        key: '1',
        name: '柜子一号',
        type: 'chest',
        price: '12',
        state:  {
        "date" : new Date(),
        "day" : 180,
        "rent" : true
       },
    }, {
        key: '2',
        name: '屋子一号',
        type: 'room',
        price: '32',
        state: {
        "date" : new Date(),
        "day" : 180,
        "rent" : false
       }
    }, {
        key: '3',
        name: '卡座一号',
        type: 'booth',
        price: '43',
        state: {
        "date" : new Date(),
        "day" : 180,
        "rent" : true
       }
    }
];


class Container extends React.Component {
    state = {
        title: '',
        name: '',
        type: '',
        price: '',
        state: '',
        show: false,
        maplist:[],
        mapname:'',
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
                render: (data) => (data.state.rent ? '已购买' : '空闲')
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
        const {name, type, price, state, key, mapname} = this.state
        const data = {
            name,
            type,
            price,
            state,
            key
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
        this.setState({name: '', type: '', price: '', state: '', key: ''})

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
        this.setState({name: '', type: '', price: '', state: '', key: ''})

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
            space: a.space
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
            this.setState({name: '', type: '', price: '', state: '', key: ''})
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
                <Modal title={title} visible={show} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                    <Input style={{
                        width: '100%'
                    }} value={name} onChange={({target}) => this.setState({name: target.value})} addonBefore={'商品名字'}/>
                    <Select defaultValue={type} style={{
                        width: '100%'
                    }} onChange={(v)=> this.setState({type: v})}>
                    <Option value={'room'}>{'房间'}</Option>
                    <Option value={'booth'}>{'卡座'}</Option>
                    <Option value={'chest'}>{'柜子'}</Option>
                    </Select>

                    <Input style={{
                        width: '100%'
                    }} value={price} onChange={({target}) => this.setState({price: target.value})} addonBefore={'价格'}/>

                </Modal>
            </div>
        )
    }
}



export default Container
