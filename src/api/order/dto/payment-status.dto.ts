export type WebhookEventType =
  | 'payment.waiting_for_capture'
  | 'payment.succeeded'
  | 'payment.canceled'
  | 'refund.succeeded';

class AmountPayment {
  value!: string;
  currency!: string;
}

class ObjectPayment {
  id!: string;
  status!: string;
  amount!: AmountPayment;
  payment_method!: {
    type: string;
    id: string;
    saved: boolean;
    title: string;
    card: object;
  };
  created_at!: string;
  expires_at!: string;
  description!: string;
  metadata?: {
    orderId?: string;
  };
}

export class PaymentStatusDto {
  event!: WebhookEventType;
  type!: string;
  object!: ObjectPayment;
}
