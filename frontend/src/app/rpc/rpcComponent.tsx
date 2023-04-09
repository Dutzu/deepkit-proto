'use client';

import {useState} from 'react';
import {RpcWebSocketClient} from '@deepkit/rpc';
import {RpcController} from '../../../../backend/src/controllers/rpc.controller';

const RpcComponent = () => {
    const [count, setCount] = useState(0);
    const [title, setTitle] = useState('');
    const [users, setUsers] = useState<string[]>([]);

    //load 100 numbers into an array. the numbers must be random from 1 to 3800
    const numbers: number[] = [];
    for (let i = 0; i < 100; i++) {
        numbers.push(Math.floor(Math.random() * 3800) + 1);
    }

    const client = new RpcWebSocketClient('ws://localhost:8080');
    const controller = client.controller<RpcController>('test-rpc');
    const buttonClass = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

    async function clickHandler() {
        setCount(count + 1)
        const result = await controller.hello('World');
        const observable = await controller.timesSubject()
        observable.subscribe((value) => {
                console.log('timesObservable', value);
                setTitle(value.toISOString());
            }
        )
        setTitle(result);
        const userSubject = await controller.users()
        userSubject.subscribe((value) => {
            setUsers((prevUsers) => ([...prevUsers, value.username]));
        });
    }

    async function handleHTTPCall() {
        const start = performance.now();
        const response = await fetch('http://localhost:8080/users/');
        await response.json();
        const end = performance.now();
        console.log('HTTP call took', end - start);
    }

    async function handleRPCCall() {
        const start = performance.now();
        await controller.getAllUsers();
        const end = performance.now();
        console.log('RPC call took', end - start);
    }

    async function handleRPCCall100() {
        const start = performance.now();
        const rpcCalls = numbers.map((number) =>
             controller.getUserById(number)
        );
        const responses = await Promise.all(rpcCalls);
        console.log(responses);
        const end = performance.now();
        console.log('RPC call took', end - start);
    }

    async function handleHTTPCall100() {
        const start = performance.now();
        const fetchCalls = numbers.map((number) => fetch(`http://localhost:8080/users/${number}`));
        const result = await Promise.all(fetchCalls);
        const jsonResponses = await Promise.all(result.map((response) => response.json()));
        console.log(jsonResponses);
        const end = performance.now();
        console.log('HTTP call took', end - start);
    }

    return (
        <div>
            <div>
            <p>Here we test the RPC.</p>
            <p>You clicked {count} times</p>
            <button onClick={clickHandler} className={buttonClass}>Click me</button>
            <p>Server said {title}</p>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
            </div>
            <div>
                <h2>Perf test load 1000 at once</h2>
                <button onClick={handleHTTPCall} className={buttonClass}>HTTP</button>
                <button onClick={handleRPCCall} className={buttonClass}>RPC</button>
            </div>
            <div>
                <h2>Perf test load 100 each</h2>
                <button onClick={handleHTTPCall100} className={buttonClass}>HTTP x100</button>
                <button onClick={handleRPCCall100} className={buttonClass}>RPC x100</button>
            </div>
        </div>
    );
}
export default RpcComponent;
