import React from 'react';
import { Chart } from 'primereact/chart';
//import { ProductService } from '../service/ProductService';
//import { EventService } from '../service/EventService';


const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860'
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e'
        }
    ]
};

const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#2f4860',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#00bb7e',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

export const Dashboard = () => {


     return (
        <div className="p-grid p-fluid dashboard">
            <div className="p-col-12 p-lg-4">
                <div className="card summary">
                    <span className="title">Users</span>
                    <span className="detail">Number of visitors</span>
                    <span className="count visitors">12</span>
                </div>
            </div>
            <div className="p-col-12 p-lg-4">
                <div className="card summary">
                    <span className="title">Sales</span>
                    <span className="detail">Number of purchases</span>
                    <span className="count purchases">534</span>
                </div>
            </div>
            <div className="p-col-12 p-lg-4">
                <div className="card summary">
                    <span className="title">Revenue</span>
                    <span className="detail">Income for today</span>
                    <span className="count revenue">$3,200</span>
                </div>
            </div>

            <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                    <div className="initials" style={{ backgroundColor: '#007be5', color: '#00448f' }}><span>TV</span></div>
                    <div className="highlight-details ">
                        <i className="pi pi-search"></i>
                        <span>Total Queries</span>
                        <span className="count">523</span>
                    </div>
                </div>
            </div>
            <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                    <div className="initials" style={{ backgroundColor: '#ef6262', color: '#a83d3b' }}><span>TI</span></div>
                    <div className="highlight-details ">
                        <i className="pi pi-question-circle"></i>
                        <span>Total Issues</span>
                        <span className="count">81</span>
                    </div>
                </div>
            </div>
            <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                    <div className="initials" style={{ backgroundColor: '#20d077', color: '#038d4a' }}><span>OI</span></div>
                    <div className="highlight-details ">
                        <i className="pi pi-filter"></i>
                        <span>Open Issues</span>
                        <span className="count">21</span>
                    </div>
                </div>
            </div>
            <div className="p-col-12 p-md-6 p-xl-3">
                <div className="highlight-box">
                    <div className="initials" style={{ backgroundColor: '#f9c851', color: '#b58c2b' }}><span>CI</span></div>
                    <div className="highlight-details ">
                        <i className="pi pi-check"></i>
                        <span>Closed Issues</span>
                        <span className="count">60</span>
                    </div>
                </div>
            </div>

                                                                                                  
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <Chart type="bar" data={barData} />
                </div>
            </div>
            
            <div className="p-col-12 p-lg-6">
                <div className="card">
                    <Chart type="line" data={lineData} />
                </div>
            </div>

           
        </div>
    );
}
