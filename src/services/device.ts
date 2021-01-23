import { LoginCredentials } from "@/models/User";

function instanceOfLoginCredentials(object: any): object is LoginCredentials {
  return "email" in object && "password" in object;
}

export default {
  get(): LoginCredentials | null {
    const serializedDevice = localStorage.getItem("device");
    if (serializedDevice) {
      const device = JSON.parse(serializedDevice);
      return instanceOfLoginCredentials(device) ? device : null;
    } else {
      return null;
    }
  },
  set(device: LoginCredentials) {
    localStorage.setItem("device", JSON.stringify(device));
  },
  remove() {
    localStorage.removeItem("device");
  },
};

function generateId(): string {
  return String(Date.now());
}

function getId(): string {
  let id = localStorage.getItem("device-id");
  if (id === null) {
    id = generateId();
    localStorage.setItem("device-id", id);
  }
  return id;
}

const deviceId = getId();
export { deviceId };
