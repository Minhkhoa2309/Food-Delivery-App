import React from 'react'
import OrdersData from '../../components/layout/dashboard/order.data'
import InvoiceCharts from '../../components/charts/invoices.chart'

const DashboardData = () => {
    return (
        <div className='w-full flex p-8 items-center justify-between'>
            <div className="w-[56%]">
                <h3 className="text-2xl pb-2">Recents Orders</h3>
                {/* Order Data */}
                <OrdersData isDashboard={true} />
            </div>
            <div className="w-[43%]">
                <h3 className="text-2xl mb-[-2rem]">Order Analytics</h3>
                {/* Invoice Charts */}
                <InvoiceCharts />
            </div>
        </div>
    )
}

export default DashboardData