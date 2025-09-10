export const getShippingStatusText = (value: number) => {
    if(value == -1) {
        return "Cancelled";
    }else if(value == 0) {
        return "Not Set";
    } else if (value == 1) {
        return "Order Placed";
    } else if (value == 2) {
        return "Order Received";
    } else if(value == 3) {
        return "Order Accepted / Processing";
    } else if (value == 4) {
        return "Order Ready for Dispatch";
    } else if (value == 5) {
        return "Order Shipped";
    } else if(value == 6) {
        return "Order Out for Delivery";
    } else if(value == 7) {
        return "Order Delivered";
    } else if(value == 8) {
        return "Feedback Request";
    }
}
