const exec = require('child_process').exec
exec('/usr/nft.AppImage', (err, stdout) => {
  if (err) {
    console.log(err)
  }
  console.log(stdout)
})
