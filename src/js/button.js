export const test = async () => {
  const filters = [{ usbVendorId: 4292, usbProductId: 60000 }];
  const port = await navigator.serial.requestPort({ filters });
  port.ondisconnect = () => window.location.reload();

  console.log({ port });

  await port.open({ baudRate: 9600 });

  const reader = port.readable.getReader();
  const writer = port.writable.getWriter();
};

navigator.serial.addEventListener("connect", (e) => {
  console.warn("connect", e.target);
});

navigator.serial.addEventListener("disconnect", (e) => {
  console.warn("disconnect", e.target);
});

navigator.serial.getPorts().then((ports) => {
  console.warn("ports", ports);
});
