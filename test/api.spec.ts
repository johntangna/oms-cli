import { getAllFrameworList } from "../utils/framework";
describe("api", () => {
  test("testApi", () => {
    console.info = jest.fn();
    getAllFrameworList();
  });
});
