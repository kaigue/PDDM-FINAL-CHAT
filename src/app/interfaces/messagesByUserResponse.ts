export interface MessagesByUserResponse {
    id:          number;
    sender_id:   number;
    receiver_id: number;
    content:     string;
    type:        string;
    sent_at:     Date;
}
