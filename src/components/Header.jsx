import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Divider, Layout, Menu, List, Popover, Empty, Badge, Popconfirm, Collapse, Checkbox, Avatar } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Link,
  NavLink,
  useNavigate,
  useParams
} from 'react-router-dom'
import { useBreadcrumbs } from '../hooks/useBreadcrumbs'
import UserProfile from './UserProfile'
import logo from '../assets/images/cloudimts.jpg'
import { NotificationOutlined, DeleteOutlined, ReloadOutlined, ExportOutlined, SearchOutlined, CloudUploadOutlined, HistoryOutlined } from '@ant-design/icons'
import { MdDeleteSweep, MdOutlineHomeWork } from 'react-icons/md'
import { AiOutlinePlus } from 'react-icons/ai'
import {
  AiOutlineUserAdd,
  AiOutlineFilter,
  AiOutlineFileSync,
  AiOutlineMail
} from 'react-icons/ai'
import HeaderButton from './HeaderButton'
import StudyFilterModal from './StudyFilterModal'
import { getFilterList } from '../apis/studiesApi'
import { UserPermissionContext } from '../hooks/userPermissionContext'
import { FaMoneyBill, FaUserLock } from 'react-icons/fa'
import { CgTemplate } from 'react-icons/cg'
import { BiSupport } from 'react-icons/bi'
import { filterDataContext } from '../hooks/filterDataContext'
import NotificationMessage from './NotificationMessage'
import { StudyIdContext } from '../hooks/studyIdContext'
import { deleteStudy } from '../apis/studiesApi'
import { FilterSelectedContext } from '../hooks/filterSelectedContext'
import { retrieveSystemFilters } from '../helpers/studyDataFilter'
import { StudyDataContext } from '../hooks/studyDataContext'

const { Header, Sider, Content } = Layout

const BasicLayout = ({ children }) => {
  const contentRef = useRef()
  const { id } = useParams()
  const [sidebrCollapsed, setSidebarCollapsed] = useState(true)
  const [role, setRole] = useState('')
  const [collapsed, setCollapsed] = useState(true)
  const [token, setToken] = useState(null)
  const { setIsModalOpen } = useBreadcrumbs()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState([])
  const { permissionData } = useContext(UserPermissionContext)
  const [userPermissionData, setUserPermissionData] = useState({})

  // Study page related context 
  const { chatNotificationData, setIsStudyExportModalOpen, setIsQuickAssignStudyModalOpen, setIsAdvancedSearchModalOpen, setChatNotificationData } = useContext(filterDataContext)
  const { studyIdArray, setStudyIdArray } = useContext(StudyIdContext)
  const {
    isFilterSelected,
    isAdvanceSearchSelected,
    setIsAdvanceSearchSelected
  } = useContext(FilterSelectedContext)
  const {
    setStudyDataPayload,
    setStudyData,
    setSystemFilterPayload,
    studyDataPayload,
    systemFilterPayload,
    studyData,
    setChatStudyData
  } = useContext(StudyDataContext)

  useEffect(() => {
    setUserPermissionData(permissionData)
  }, [permissionData])

  const navigate = useNavigate()

  useEffect(() => {
    retrieveFilterOptions()
  }, [])

  useEffect(() => {
    contentRef.current.scrollTo(0, 0)
  }, [children])

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    setRole(localStorage.getItem('role'))
  }, [role])

  const { breadCrumbs } = useBreadcrumbs()

  const onCollapse = () => {
    setSidebarCollapsed(!sidebrCollapsed)
  }

  const retrieveFilterOptions = () => {
    getFilterList()
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            label: data.filter_name,
            key: data.id
          }))
          setFilterOptions(resData)
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

  const menuLabel = title => (
    <div className='display-flex-between' style={{ gap: '4px' }}>
      {title}
    </div>
  )

  const checkPermissionStatus = name => {
    const permission = userPermissionData['Menu Permission']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const otherPremissionStatus = (title, permission_name) => {
    const permission = userPermissionData[title]?.find(
      data => data.permission === permission_name
    )?.permission_value
    return permission
  }

  const menuItems = [

    // Studies option
    checkPermissionStatus('Show Studies option') && {
      label: <NavLink to={'/studies'}>Studies</NavLink>,
      key: 'studies',
      icon: <AiOutlineFileSync />
    },

    // Institution option
    checkPermissionStatus('Show Option - Institution option') && {
      label: <NavLink to={"/institutions"}>Institution</NavLink>,
      key: 'SubMenu',
      icon: <MdOutlineHomeWork />,
      // children: [
      //   {
      //     label: <NavLink to={'/institutions'}>All Institution</NavLink>,
      //     key: 'all-institution'
      //   },
      //   {
      //     label: <NavLink to={'/institutions/add'}>Create Institution</NavLink>,
      //     key: 'add-institution'
      //   }
      // ]
    },

    // User option
    checkPermissionStatus('Show Option - User option') && {
      label: <NavLink to={"/users"}>User</NavLink>,
      key: 'users',
      icon: <AiOutlineUserAdd />,
      // children: [
      //   {
      //     label: <NavLink to={'/users'}>All Users</NavLink>,
      //     key: 'all-users'
      //   },
      //   {
      //     label: <NavLink to={'/users/add'}>Create Users</NavLink>,
      //     key: 'add-users'
      //   }
      // ]
    },

    // Role option
    checkPermissionStatus('Show Option - Role option') && {
      label: <NavLink to={'/users/roles'}>Roles</NavLink>,
      key: 'roles',
      icon: <FaUserLock />
    },

    // Chat option
    checkPermissionStatus('Show Chat Option') && {
      label: <NavLink to={'/chats'}>Chats</NavLink>,
      key: 'Chats',
      icon: <WechatOutlined style={{ height: '20px', width: '20px' }} />,
      className: 'Chat-icon'
    },

    // Email option
    // checkPermissionStatus('Show Option - Email option') && {
    //   label: <NavLink to={'/users/email'}>Email</NavLink>,
    //   key: 'email',
    //   icon: <AiOutlineMail />
    // },

    // Template option
    checkPermissionStatus('Show Option - Template option') && {
      label: <NavLink to={'/reports'}>Templates</NavLink>,
      key: 'templates',
      icon: <CgTemplate />
    },

    // Billing option
    checkPermissionStatus('Show Option - Billing option') && {
      label: <NavLink to={'/billing'}>Billing</NavLink>,
      key: 'billing',
      icon: <FaMoneyBill />
    },

    // StudyTable option
    userPermissionData['StudyTable view']?.find(
      data => data.permission === 'View Deleted studies'
    )?.permission_value && {
      label: <NavLink to={'/deleted-studies'}>Deleted Studies</NavLink>,
      key: 'deletedStudy',
      icon: <MdDeleteSweep color='red' />
    },

    // Support option
    {
      label: <NavLink to={'/support'}>Support</NavLink>,
      key: 'support',
      icon: <BiSupport />
    },

    // Support option
    checkPermissionStatus('Show Upload image option') &&
    {
      label: <NavLink to={'/upload'}>Upload image</NavLink>,
      key: 'Upload image',
      icon: <CloudUploadOutlined />, 
      children : [
        {
          label: <NavLink to={"/upload"}>Upload dicom images</NavLink>, 
          key: "Dicom image"
        }, 
        {
          label: <NavLink to={"/manual-entry"}>ImageUpload</NavLink>, 
          key: "Image upload"
        }
      ]
    },

    // Upload history related option

    checkPermissionStatus('Show Upload history option') && {
      label: <NavLink to={'/uploadhistory'}>Upload history</NavLink>,
      key: 'Upload history',
      icon: <HistoryOutlined />
    },

    // Filter option
    {
      label: <NavLink to={'/filters'}>Filters</NavLink>,
      key: 'filters',
      icon: <AiOutlineFilter />
    },

  ].filter(Boolean);


  const menu = (
    <Sider
      className='sidebar-wrapper'
      theme='light'
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
    >
      {checkPermissionStatus("Show Dashboard option") ? <>
        <Link to='/dashboard'>
          <div className='logo sidebar-logo'>
            <img src={logo} alt='Logo' />
          </div>
        </Link>
      </> : <>
        <div className='logo sidebar-logo'>
          <img src={logo} alt='Logo' />
        </div>

      </>}

      <div className='sidebar-menu-wrap' style={{ overflow: 'hidden' }}>
        <Menu
          mode='inline'
          theme='light'
          items={menuItems}
          className='header-menu'
        />
      </div>

    </Sider>
  )

  // **** Chat notification data handle **** // 

  const [chatNotificationTitle, setChatNotificationTitle] = useState([]);
  const [isFilterChecked, setIsFilterChecked] = useState(null)
  const [isSystemFilterChecked, setIsSystemFilterChecked] = useState(null)

  // Notification message press handler 
  const ChatMessageClickHandler = (reference_id) => {
    setChatStudyData(reference_id)
  }

  // Clear notification message handler
  const ClearNotificationMessageHandler = () => {
    localStorage.removeItem("chat-data");
    setChatNotificationData([]);
  }

  const notification_content = (
    <div>
      <Button danger onClick={() => { ClearNotificationMessageHandler() }}>Clear notification</Button>
      <List
        style={{ width: "30rem", height: "30rem", overflowY: "auto" }}
        itemLayout="horizontal"
        dataSource={chatNotificationTitle}
        className='chat-message-notification-layout'
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              onClick={() => { ChatMessageClickHandler(item?.studyId); }}
              className='chat-notification'
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={item.title}
              description={item?.description}
            />
          </List.Item>
        )}
      />
    </div>
  )

  const SetChatNotificationData = () => {

    let tempData = localStorage.getItem("chat-data");

    if (tempData !== null) {

      tempData = JSON.parse(tempData);
      const updatedTitles = tempData.map((element) => ({
        title: element?.title,
        description: element?.message,
        studyId: element?.Patientid
      }));

      setChatNotificationTitle([...updatedTitles]);
    } else {
      setChatNotificationTitle([]);
    }

  }

  useEffect(() => {
    SetChatNotificationData();
  }, [chatNotificationData])


  // **** Delete study option for Study page **** // 

  const deleteStudyData = async () => {

    if (studyIdArray.length > 0) {
      deleteStudy({ id: studyIdArray })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', "Study delete successfully");
            setStudyIdArray([]);
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
    } else {
      NotificationMessage('warning', 'Please select study for delete')
    }
  }


  // **** Quick assign study option handler for Study page **** // 

  const QuickAssignStudyModalHandler = () => {
    if (studyIdArray.length === 0) {
      NotificationMessage("warning", "Please, Select study for assign");
    } else {
      setIsQuickAssignStudyModalOpen(true);
    }
  }

  // ==== Study page filter dropdown ===== //   

  const [systemFilters, setSystemsFilters] = useState([])

  // **** Reterive system filter list for Study page **** // 

  const fetchSystemFilter = async () => {

    const response = await retrieveSystemFilters()

    const modifiedOptions = response.map(data => ({
      label: data.name,
      value: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      key: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      details: data.filter_data
    }))

    setSystemsFilters(modifiedOptions);
  }


  useEffect(() => {
    if (window.location.pathname === '/studies') {
      fetchSystemFilter()
    }
  }, [window.location.pathname])


  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>

        {menu}

        <Layout className='site-layout'>

          <Header
            className='site-layout-background'
            style={{
              padding: 0,
              backgroundColor: '#fff',
              boxShadow: 'none'
            }}
          >
            <div
              style={{
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              className='header-menu-icon'
            >

              {/* Collapse menu option  */}
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: 'trigger',
                  onClick: () => setCollapsed(!collapsed)
                }
              )}

              {/* Dashboard option  */}
              {checkPermissionStatus("Show Dashboard option") &&

                <AppstoreOutlined
                  style={{ fontSize: '24px', color: '#000000b4' }}
                  onClick={() => navigate('/dashboard')}
                />
              }


              <Divider type='vertical' className='vertical-divider' />

              <Breadcrumb
                separator='|'
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#fff',
                  justifyContent: 'center'
                }}
                className='header-breadcrumb'
              >
                {breadCrumbs.length > 0 &&
                  breadCrumbs.map((crumb, index) => (
                    <Breadcrumb.Item key={index}>
                      {crumb.to ? (
                        <Link to={crumb.to} title={crumb.name}>
                          {crumb.name}
                        </Link>
                      ) : (
                        crumb.name
                      )}
                    </Breadcrumb.Item>
                  ))}
              </Breadcrumb>

              {window.location.pathname == "/studies" && (

                <div className='iod-setting-div' style={{ marginLeft: "1rem" }}>

                  {/* ==== Notification option ====  */}

                  <Popover 
                    content={chatNotificationTitle?.length > 0 ? notification_content : <><Empty /></>}
                    title={"Notifications"} placement='bottomLeft'>
                    <Badge count={chatNotificationTitle?.length}>
                      <Button
                        type='default'
                        className=''
                      >
                        <NotificationOutlined />
                      </Button>
                    </Badge>
                  </Popover>

                  {/* ==== Delete Study option ====  */}

                  {otherPremissionStatus("Studies permission", "Delete Study") && (
                    <Popconfirm
                      title="Delete study"
                      description="Are you sure you want to delete this studies ?"
                      onConfirm={deleteStudyData}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type='primary'
                        className='error-btn-primary'
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm> 
                  )}


                  {/* ==== Reload option ====  */}

                  <Button
                    type='primary'
                    className='header-secondary-option-button'
                    onClick={() => {
                      window.location.reload() ; 
                    }}
                  >
                    <ReloadOutlined />
                  </Button>

                  {/* ==== Study export option handler ====  */}

                  <Button
                    type='primary'

                    onClick={() => setIsStudyExportModalOpen(true)}
                    className='header-secondary-option-button'
                  >
                    <ExportOutlined style={{ marginRight: "0.4rem" }} /> Study Export
                  </Button>

                  {/* ==== Assign study option handler ====  */}

                  {otherPremissionStatus("Studies permission", "Top Assign") && (
                    <Button
                      type='primary'
                      onClick={() => QuickAssignStudyModalHandler()}
                      className='header-secondary-option-button'
                    >
                      Assign study
                    </Button>
                  )}

                  {/* ==== Study logs option ====  */}

                  <Button
                    type='primary'
                    onClick={() => navigate('/study-logs')}
                    className='header-secondary-option-button'
                  >
                    Study logs
                  </Button>

                  {/* ==== Advanced search option ====  */}

                  <Button
                    type='primary'
                    className={`btn-icon-div ${isAdvanceSearchSelected && 'filter-selected'}`}
                    onClick={() => setIsAdvancedSearchModalOpen(true)}
                  >
                    <SearchOutlined style={{ fontWeight: '500' }} />
                    Advanced search
                  </Button>

                  {/* ==== Filter option ====  */}

                  {/* <div style={{ position: 'relative' }}>
                    <Popover
                      content={content}
                      title={null}
                      trigger='click'
                      style={{ minWidth: '300px' }}
                      className='filter-popover'
                    >
                      <Button
                        type='primary'
                        className={`btn-icon-div ${(Object.keys(systemFilterPayload)?.length !== 0 ||
                          Object.keys(studyDataPayload)?.length !== 0) &&
                          'filter-selected'
                          }`}
                        onClick={() => setIsFilterCollapseOpen(prev => !prev)}
                      >
                        <FilterOutlined style={{ fontWeight: '500' }} /> Filters
                      </Button>
                    </Popover>
                  </div> */}


                </div>

              )}


              <UserProfile />

            </div>

          </Header>

          <Content
            ref={contentRef}
            className='site-layout-background'
            style={
              window.location.pathname === '/chats' ||
                window.location.pathname === '/dashboard' ||
                window.location.pathname === `/create-orders/${id}/edit` ||
                window.location.pathname === `/reports/${id}`
                ? {
                  padding: 0,
                  height: 'calc(100vh - 75px)',
                  overflow: 'hidden',
                  overflowX: 'hidden',
                  minHeight: 280
                }
                : {
                  height: 'calc(100vh - 75px)',
                  overflow: 'hidden',
                  overflowX: 'hidden',
                  minHeight: 280,
                  paddingBottom: 20
                }
            }
          >
            {' '}
            {window.location.pathname !== '/chats' &&
              window.location.pathname !== '/dashboard' && (
                <div className='breadcrumb-div'>
                  <HeaderButton
                    setIsModalOpen={setIsModalOpen}
                    id={id}
                    filterOptions={filterOptions}
                    retrieveFilterOptions={retrieveFilterOptions}
                  />
                </div>
              )}
            <div
              style={
                window.location.pathname !== '/chats'
                  ? {
                    paddingLeft: '12px',
                    paddingRight: '12px'
                  }
                  : { padding: '0px' }
              }
            >
              {children}
            </div>
          </Content>

        </Layout>

      </Layout>

      <StudyFilterModal
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        retrieveFilterOptions={retrieveFilterOptions}
      />
    </>
  )
}
export default BasicLayout
