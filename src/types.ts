export interface DeliveryTask {
  Task_Status: 'Completed' | 'InProgress' | 'Suspended' | 'Cancelled' | 'Delayed' | 'Failed';
  Driver_Name: string;
  Rating: 'ممتاز' | 'متوسط' | 'سيء';
  Customer_Comment: string;
  Customer_Name: string;
  Customer_Phone: string;
  Ticket_Status: 'تم الحل' | 'معلقة';
  Team_Name: string;
  Creation_DateTime: string;
}
