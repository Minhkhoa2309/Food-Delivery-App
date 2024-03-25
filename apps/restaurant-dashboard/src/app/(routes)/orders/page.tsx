import OrderData from "../../../shared/components/data/order.data"

const Orders = () => {
  return (
    <div className="md:w-[90%] xl:w-[75%] m-auto">
      <h1 className="text-4xl text-center pt-3">All Orders</h1>
      <OrderData isDashboard={false} />
    </div>
  )
}

export default Orders