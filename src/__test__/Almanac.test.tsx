import React from "react";
import Almanac from "../Almanac";
import {
  render,
  fireEvent,
  cleanup,
  wait,
  RenderResult
} from "@testing-library/react";
import { act } from "react-dom/test-utils";

describe("test", () => {
  let container: RenderResult;
  let inputEl: HTMLElement;
  let showBtnEl: HTMLElement;
  //@ts-ignore
  global.alert = jest.fn();
  //@ts-ignore
  const mockAlert = global.alert;
  beforeEach(() => {
    act(() => {
      //@ts-ignore
      container = render(<Almanac />);
    });
    showBtnEl = container.getByTestId("almanac-showBtn");
    inputEl = container.getByTestId("almanac-input");
  });
  afterEach(() => {
    cleanup()
    mockAlert.mockReset();
  });
  test("not crash", () => {
    expect(container.getAllByTestId("almanacWrapper")).toHaveLength(1);
  });
  test("when input is 2019, the first day of first week is 30", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = 2019;
      fireEvent.click(showBtnEl);
    });
    const weeks = container.getAllByTestId("week");
    expect(weeks[0].childNodes[0].textContent).toBe("30");
  });
  test("when input is 2019, the first day of 7th week is 27", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = 2019;
      fireEvent.click(showBtnEl);
    });
    const weeks = container.getAllByTestId("week");
    expect(weeks[6].childNodes[0].textContent).toBe("27");
  });
  test("when input is 0, alert should haved be called", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = 0;
      fireEvent.click(showBtnEl);
    });
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });
  test("when input is 10000, alert should haved be called", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = 10000;
      fireEvent.click(showBtnEl);
    });
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });
  test("when input is not integer, alert should haved be called", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = 10.123;
      fireEvent.click(showBtnEl);
    });
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });

  test("when input is not number, alert should haved be called", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = "qwewq";
      fireEvent.click(showBtnEl);
    });
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });

  test("today is pick", () => {
    const today = new Date();
    const monthIndex = today.getMonth();
    const date = today.getDate();
    const el = container.container.querySelector(
      `[data-monthanddate='${monthIndex},${date}']`
    );
    expect(el).toHaveClass("almanac-day--pick");
  });
  test("today but not 2020 is not pick", () => {
    act(() => {
      //@ts-ignore
      inputEl.value = 2019;
      fireEvent.click(showBtnEl);
    });
    const today = new Date();
    const monthIndex = today.getMonth();
    const date = today.getDate();
    const el = container.container.querySelector(
      `[data-monthanddate='${monthIndex},${date}']`
    );
    if (el) {
      expect(el).not.toHaveClass("almanac-day--pick");
    }
  });
});
