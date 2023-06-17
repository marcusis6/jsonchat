import { BaseDto } from "./BaseDto";
import bcrypt from "bcrypt";

class UserDto extends BaseDto {
  username: string;
  password: string;
  confirmPassword: string;
  lang_pref: string;
  active: boolean;
  isAdmin: boolean;
  createdDate: Date | undefined;
  isSuperAdmin: boolean;
  soundPref = true;

  constructor(json: any) {
    super(json);
    // Assign values with falsy checks
    this.username = json?.username || "";
    this.password = json?.password || "";
    this.confirmPassword = json?.confirmPassword || "";
    this.lang_pref = json?.lang_pref || "en";
    this.active = json?.active || false;
    this.isAdmin = json?.isAdmin || false;
    this.isSuperAdmin = json.isSuperAdmin || false;
    this.soundPref = json.soundPref === undefined ? true : json.soundPref;
  }

  isValid() {
    return !!this.username?.trim();
  }

  isValidCredentials() {
    // if username or password is empty or null, then invalid
    return !!this.username?.trim() && !!this.password?.trim();
  }

  getPasswordHash(saltRounds = 10) {
    // if password is empty or null, then return empty string else the hashed password
    return this.password?.trim()
      ? bcrypt.hashSync(this.password, saltRounds)
      : "";
  }

  arePasswordsIdentical(): boolean {
    return this.password === this.confirmPassword;
  }
}

/**
 * Represents current loggedin User
 */
class SessionUser {
  id: string;
  username: string;
  lang_pref: string;
  active: boolean;
  isAdmin: boolean;
  soundPref: boolean;

  constructor(
    id: string,
    username: string,
    lang_pref: string,
    active: boolean,
    isAdmin: boolean,
    soundPref: boolean
  ) {
    this.id = id;
    this.username = username;
    this.lang_pref = lang_pref;
    this.active = active;
    this.isAdmin = isAdmin;
    this.soundPref = soundPref;
  }
}

export { UserDto, SessionUser };
