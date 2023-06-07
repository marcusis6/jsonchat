class Message {
  sequence_id: number;
  text: string;
  username: string;
  sender: string;

  constructor(json: any = {}) {
    this.sequence_id = json.sequence_id || 0;
    this.text = json.text || "";
    this.username = json.username || "";
    this.sender = json.sender || "";
  }
}
export { Message };
