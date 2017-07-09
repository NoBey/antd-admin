import React from 'react'
import PropTypes from 'prop-types'
import {Table, Modal} from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import {DropOption} from 'components'
import {Link} from 'dva/router'

const confirm = Modal.confirm

const List = ({
  onDeleteItem,
  onEditItem,
  isMotion,
  location,
  ...tableProps
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk() {
          onDeleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: '头像',
      dataIndex: 'avator',
      key: 'avator',
      width: 64,
      className: styles.avatar,
      render: (text) => <img alt={'avatar'} width={24} src={text || 'http://img4.imgtn.bdimg.com/it/u=1033329440,3258066026&fm=26&gp=0.jpg'}/>
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => text
    }, {
      title: '职位',
      dataIndex: 'position',
      key: 'position'
    }, {
      title: '公司',
      dataIndex: 'company',
      key: 'company'
    }, {
      title: 'QQ',
      dataIndex: 'qq',
      key: 'qq'
    }, {
      title: '微信',
      dataIndex: 'weixin',
      key: 'weixin'
    }, {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: '创建日期',
      dataIndex: 'created_at',
      key: 'createTime'
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{
            key: '1',
            name: '修改'
          }
        ]}/>
      }
    }
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current
  }

  const getBodyWrapper = body => {
    return isMotion
      ? <AnimTableBody {...getBodyWrapperProps} body={body}/>
      : body
  }

  return (
    <div>
      <Table {...tableProps} className={classnames({
        [styles.table]: true,
        [styles.motion]: isMotion
      })} bordered scroll={{
        x: 1250
      }} columns={columns} simple rowKey={record => record.id} getBodyWrapper={getBodyWrapper}/>

    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object
}

export default List
