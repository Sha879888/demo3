import React, { useState, useEffect } from 'react';

import './App.css';

let App = () => {

  let [users, setUsers] = useState([]);
  let [orders, setOrders] = useState([]);
  let [userOrders, setUserOrders] = useState([]);

  // . . . Состояния для окна регистрации . . . //
  let [userLogin, setUserLogin] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [userSubname1, setUserSubname1] = useState('');
  let [userSubname2, setUserSubname2] = useState('');
  let [userPhone, setUserPhone] = useState('');
  let [userEmail, setUserEmail] = useState('');

  // . . . Состояния для окна бронирования . . . //
  let [userTime, setUserTime] = useState('');
  let [userDate, setUserDate] = useState('');
  let [userCount, setUserCount] = useState('');
  let [userOrderPhone, setUserOrderPhone] = useState('');

  // . . . Состояния входа/выхода в системе . . . //
  let [isLogin, setLogin] = useState(false);
  let [isLogined, setLogined] = useState(false);

  let currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => { getUsers(); getOrders(); getUserOrders(); }, []);

  let addUser = async () => {
    let response = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        login: userLogin, password: userPassword, subname1: userSubname1, subname2: userSubname2, phone: userPhone, email: userEmail, role: 'user'
      })
    });

    let data = await response.json();

    setUsers([...users, data]);
  }

  let addOrder = async () => {
    let response = await fetch('http://localhost:5000/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ date: userDate, time: userTime, count: userCount, userid: currentUser.user.id, phone: userOrderPhone, status: 'новое' })
    });

    let data = await response.json();

    console.log(data);

    setOrders([...orders, data]);
  }

  let getUsers = async () => {
    let response = await fetch('http://localhost:5000/users');

    let data = await response.json();

    setUsers(data);
  }

  let getOrders = async () => {
    let response = await fetch('http://localhost:5000/orders');

    let data = await response.json();

    setOrders(data);
  }

  let getUserOrders = async () => {
    let response = await fetch('http://localhost:5000/userOrders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userid: currentUser.user.id })
    });

    let data = await response.json();
    setUserOrders(data);
    console.log(data);
  }
  let registration = () => {
    let check = false;

    getUsers();

    if (users <= 0) {
      addUser();
      setLogined(true);
    }

    for (let user of users) {      
      if (userLogin == user.login) {
        check = false;
        break;
      } else {
        check = true;
      }
    }

    if (check) {
      addUser()
      setLogin(false);
    } else {
      alert('Такой пользователь уже существует');
    }
  }

  let login = () => {
    let check = false;

    for (let user of users) {      
      if (userLogin == user.login & userPassword == user.password) {
        check = true;
        localStorage.setItem('currentUser', JSON.stringify({user}));
        break;
      } else {
        check = false;
      }
    }

    if (check) {
      setLogined(true);
      getUserOrders();
    } else {
      alert('Неправильный логин или пароль');
    }
  }

  return (
    <div className="App">
      { !isLogined ? (
        <div className='LoginFormContainer'>
        <div className='img'></div>
        { !isLogin ? (
          <div className='LoginForm'>
            <span>Логин</span> <input onChange={(e) => setUserLogin(e.target.value)}/>
            <span>Пароль</span> <input type='password' onChange={(e) => setUserPassword(e.target.value)}/>
            <br/>
            <button onClick={() => login()}>Войти</button>
            <br/>
            <div> <span>Регистрация</span> <input type='checkbox' checked={isLogin} onChange={() => setLogin(!isLogin)}/> </div>
        </div>
        ) : (
          <div className='LoginForm'>
            <span>Логин</span> <input onChange={(e) => setUserLogin(e.target.value)}/>
            <span>Пароль</span> <input type='password' onChange={(e) => setUserPassword(e.target.value)}/>
            <span>Имя</span> <input onChange={(e) => setUserSubname1(e.target.value)}/>
            <span>Фамилия</span> <input onChange={(e) => setUserSubname2(e.target.value)}/>
            <span>Телефон</span> <input type='number' onChange={(e) => setUserPhone(e.target.value)}/>
            <span>Почта</span> <input onChange={(e) => setUserEmail(e.target.value)}/>
            <br/>
            <button onClick={() => registration()}>Зарегистрироваться</button>
            <br/>
            <div> <span>Регистрация</span> <input type='checkbox' checked={isLogin} onChange={() => setLogin(!isLogin)}/> </div>
        </div>
        )}
      </div>
      ) : (
        <div className='OrdersContainer'>
          <div className='CreatedOrders'>
            <h1>Забронированные столы</h1>
            {currentUser.user.role == 'user' ? (
              <div>
                {orders.map(el => (
                  <div className='Order'>
                    <h6>Время: {el.time}</h6>
                    <h6>Дата: {el.date}</h6>
                    <h6>Количество гостей: {el.count}</h6>
                    <h6>Контактный телефон: {el.phone}</h6>
                    <h6>Статус: {el.status}</h6>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {orders.map(el => (
                  <div className='Order'>
                    <h6>Время: {el.time}</h6>
                    <h6>Дата: {el.date}</h6>
                    <h6>Количество гостей: {el.count}</h6>
                    <h6>Контактный телефон: {el.phone}</h6>
                    <br/>
                    <div>
                    <button>Посещение состоялось</button>
                    <button>Отменено</button>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
            
          </div>
          <div className='CreateOrders'>
          <h4>Пользователь, {currentUser.user.login}</h4>
            <span>Время</span> <input type='time' onChange={(e) => setUserTime(e.target.value)} />
            <span>Дата</span> <input type='date' onChange={(e) => setUserDate(e.target.value)}/>
            <span>Количество гостей</span> <input placeholder='от 1 до 10' onChange={(e) => setUserCount(e.target.value)}/>
            <span>Номер телефона</span> <input type='number' onChange={(e) => setUserOrderPhone(e.target.value)}/>
            <button onClick={() => addOrder()}>Забронировать столик</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

