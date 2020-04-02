import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {UsersList, arr} from '../components/UsersList'
import {useHistory} from 'react-router-dom'

export const CreatePage = () => {
    const history = useHistory();
    const message =  useMessage();
    const [users, setUsers] = useState( [] );
    const {token/*, auth*/} = useContext(AuthContext);
    const {loading, request} = useHttp();
    const fetchUsers = useCallback( async () => {
        try {
            const fetched = await request('/api/user', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setUsers(fetched);
            
        } catch(e) {

        }
    }, [token, request]);
    useEffect( () => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteHandler = async () => {
        try {
            
            const data = await request('/api/user/delete', 'POST', { delId: arr });
            
            arr.length = 0;
            message(data.message);
            window.location.reload(true);
            //history.push('/');
        
        } catch (e) {
            
        }
    };

    const blockHandler = async () => {
        try {
            const data = await request('/api/user/block', 'POST', { blockId: arr });
            message(data.message);
            //const a = arr.indexOf(userId);
            //if (a) {
           // logoutHandler();
           // window.location.replace('http://localhost:3000/');
            //}
            arr.length = 0;
            window.location.reload(true);
        } catch (e) {}
    };

    const unblockHandler = async () => {
        try {
            const data = await request('/api/user/unblock', 'POST', { unblockId: arr });
            console.log(arr);
            arr.length = 0;
            message(data.message);
            window.location.reload(true);
        } catch (e) {}
    };

  /*  const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        //history.push('/');
    } */

    if(loading) {
        return <Loader />
    } 

    return(
        <>
        <div className="left">
            
            <span className="waves-effect red darken-4 btn"onClick={ deleteHandler }>Удалить</span>
            <span className="waves-effect red darken-4 btn"onClick={ blockHandler }>Заблокировать</span>
            <span className="waves-effect red darken-4 btn"onClick={ unblockHandler }>Разблокировать</span>

        </div>
        {!loading && <UsersList users={users} />}
       </> 
    )
}