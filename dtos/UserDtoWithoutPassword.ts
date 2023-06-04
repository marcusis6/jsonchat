import { UserDto } from "./UserDto";

export class UserDtoWithoutPassword extends UserDto {
  constructor(json: any) {
    super(json);

    // Set password and confirm password as empty strings to remove them
    this.password = ""; // Removing the password field
    this.confirmPassword = ""; // Removing the confirm password field
  }
}
