import React from 'react'

export let arr = [];
export const UsersList = ( {users} ) => {
const checkId = ( () => {
  arr.length = 0;
  const slaves = document.getElementsByClassName('slave');
  for (let i = 0; i < slaves.length; i++) {
    let elem = slaves.item(i)
    if (elem.checked === true)
    {
      arr.push(elem.id);
    }
    else {
      let a = arr.indexOf(elem.id);
      if (!a) {
      arr.splice(a,1);
      }
    }
  }
} );

    const checks = ( () => {
    const maine = document.getElementsByClassName('main');
    const slaves = document.getElementsByClassName('slave');
    const mainCheck = maine.item(0);
    const len = slaves.length;
    arr.length = 0;
    for (let i = 0; i < len; i++)
    {
      let elem = slaves.item(i);
      if (mainCheck.checked === true){
      elem.checked = true;
      arr.push(elem.id);
      }
      else {
        elem.checked = false;
        arr.length = 0;
      }
    }
  }); 
    
    return (
        <div>
        <table>
        <thead>
          <tr>
              <th>
      <label>
        <input type="checkbox"  className="main" onChange={checks}/>
        <span style={{color: 'black'}}>Выбрать всех</span>
      </label>
              </th>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Дата регистрации</th>
              <th>Дата последнего логина</th>
              <th>Статус</th>
          </tr>
        </thead>

        <tbody>
            { users.map((user, index) => {
                return (
                    <tr key={user._id}>
                        <td>
                        <label>
        <input type="checkbox" className="slave" id={ user._id }
        onChange={checkId}
        />
        <span></span>
      </label>
                        </td>
                    <td>{ index + 1 }</td>
                    <td>{ user.name}</td>
                    <td>{ user.email }</td>
                    <td>{ new Date(user.dateReg).toLocaleString() }</td>
                    <td>{ new Date(user.dateLog).toLocaleString() }</td>
                    <td>{ user.status }</td>
                  </tr>
                )
            }) }
        </tbody>
      </table>
      </div>
    )
}