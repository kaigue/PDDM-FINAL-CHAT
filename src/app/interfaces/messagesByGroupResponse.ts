export interface MessagesByGroupResponse {
    id:       number;
    group_id: number;
    content:  string;
    sender:   string;
    sent_at:  Date;
}
