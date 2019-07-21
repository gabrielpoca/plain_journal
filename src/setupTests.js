jest.mock("./core/Session");

import Session from "./core/Session";

Session.decrypt.mockImplementation(a => a);
Session.encrypt.mockImplementation(a => a);
