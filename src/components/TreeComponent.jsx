import React, { useState, useEffect } from 'react'
import { Divider, Tree } from 'antd'
import API from '../apis/getApi'

const { TreeNode } = Tree

const TreeComponent = props => {
  const [treeData, setTreeData] = useState([])
  const token = localStorage.getItem('token')
  useEffect(() => {
    fetchParentCategories()
  }, [])

  const fetchParentCategories = () => {
    API.get('/menu/listing?listing=main', {
      headers: { Authorization: token }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.categories_List.map(category => ({
            key: category.id,
            title: category.category_name,
            children: []
          }))
          setTreeData(resData)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Network request failed',
          err.response.data.message
        )
      )
  }

  const handleLoadData = treeNode => {
    return new Promise(resolve => {
      if (treeNode.children && treeNode.children.length > 0) {
        resolve()
        return
      }

      if (!treeNode.dataRef.parent_id) {
        API.get(`/menu/category/${treeNode.key}?listing=main`, {
          headers: { Authorization: token }
        }).then(res => {
          if (res.data.status) {
            const resData = res.data.data.subcategoriesList.categories.map(
              category => ({
                title: category.category_name,
                key: category.id,
                children: [],
                parent_id: category.parent_id
              })
            )
            const updatedTreeData = treeData.map(item => {
              if (item.key == treeNode.key) {
                return {
                  ...item,
                  children: resData
                }
              }
              return item
            })
            setTreeData(updatedTreeData)
            resolve()
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
      }
      if (treeNode.dataRef.parent_id) {
        API.get(
          `/menu/category/${treeNode.dataRef.parent_id}/subcategories/${treeNode.key}?listing=main`,
          {
            headers: { Authorization: token }
          }
        ).then(res => {
          if (res.data.status) {
            const resData =
              res.data.data.supersub_categories_List.categories.map(
                category => ({
                  title: category.category_name,
                  key: category.id,
                  parent_id: category.parent_id,
                  super_parent_id: category.super_parent_id
                })
              )

            const updatedTreeData = treeData.map(item => {
              if (item.key == treeNode.dataRef.parent_id) {
                const updatedChildren = item.children.map(category => {
                  if (category.key == treeNode.key) {
                    return {
                      ...category,
                      children: resData
                    }
                  }
                  return category
                })
                return {
                  ...item,
                  children: updatedChildren
                }
              }
              return item
            })

            setTreeData(updatedTreeData)

            resolve()
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
      }
    })
  }

  const clickHandler = (selectedKeys, { node }) => {
    if (!node.dataRef.parent_id) {
      props.retrieveCategoryData(node.key)
    }
    if (node.dataRef.parent_id && !node.dataRef.super_parent_id) {
      props.retrieveSubcategoryData(node.dataRef.parent_id, node.key)
    }
    if (node.dataRef.super_parent_id) {
      props.retrieveSuperSubcategoryData(
        node.dataRef.super_parent_id,
        node.dataRef.parent_id,
        node.key
      )
    }
  }

  const renderTreeNodes = data =>
    data.map(item => (
      <TreeNode title={item.title} key={item.key} dataRef={item}>
        {item.children && renderTreeNodes(item.children)}
      </TreeNode>
    ))

  return (
    <Tree
      loadData={handleLoadData}
      onSelect={clickHandler}
      defaultExpandAll
      className='custom-tree'
      titleRender={node => (
        <div className='custom-tree-node'>
          <div className='custom-icon'></div>
          <span className='custom-tree-node-title'>{node.title}</span>
        </div>
      )}
    >
      {renderTreeNodes(treeData)}
    </Tree>
  )
}

export default TreeComponent
