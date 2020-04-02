import React, {useState, useContext, useCallback, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {LinksList} from '../components/LinksList'
import {useHistory} from 'react-router-dom'

export const LinksPage = () => {
    const history = useHistory();
    const [link, setLink] = useState('');
    const [links, setLinks] = useState( [] );
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    useEffect( () => {
        window.M.updateTextFields();
    }, []);
    const pressHandler = async event => {
            try {
                await request('/api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer ${token}`
                });
                //history.push(`/detail/${data.link._id}`);
                history.push('/links');
            } catch (e) {}
    }  

    const fetchLinks = useCallback( async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setLinks(fetched);
        } catch(e) {

        }
    }, [token, request]);
    useEffect( () => {
        fetchLinks();
    }, [fetchLinks]);

    if(loading) {
        return <Loader />
    } 
    return(
        <>
        <div className="row">
            <div className="col s11">
                            <div className="input-field">
                            <input
                                placeholder="Вставьте текст"
                                id="link"
                                type="text"
                                value={link}
                                onChange={e => setLink(e.target.value)}
                            />
                            </div>
            </div>
            <div className="col s1" style={{ paddingTop: '1.5rem' }}>
                            <span className="btn-floating btn-small waves-effect waves-light red"
                            onClick={pressHandler, () => {window.location.reload(true);}}
                            src="Добавить заметку"
                            >
                                <i className="material-icons"><strong>+</strong></i>
                                </span>
                            </div>
    </div>
        {!loading && <LinksList links={links} />}
        </>
    )
}