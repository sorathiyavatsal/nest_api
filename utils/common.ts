export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    console.log(file, 'filelelel');
    var blob = Buffer.from(file.buffer).toString('base64');
    resolve(blob);
    reject('issue in converting file to base64');
  });
