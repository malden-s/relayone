var databuttonMB = {
  lastModified: function() { return databuttonMB._lastModified }, 
  lastModifiedDate: function() { return databuttonMB._lastModifiedDate },
  name: function() { return databuttonMB._name },
  size: function() { return databuttonMB._size },
  type: function() { return databuttonMB._type },
  file: function() { return databuttonMB._file },
  build: function(o) {
    if (o.file) {
      var buttonEl = (o.button.$el instanceof Element ? o.button.$el : document.querySelector(o.button.$el))
      var fileEl = (o.file.$el instanceof Element ? o.file.$el : document.querySelector(o.file.$el))
      fileEl.onchange = function(e) {
        var filetype = e.target.files[0].type
        for(var key in e.target.files[0]) {
          databuttonMB["_" + key] = e.target.files[0][key]
        }
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
          var d = o.file.data
          databuttonMB._file = event.target.result
          d.forEach(function(item, index) {
            if (typeof item === 'function') { d[index] = item() }
            else if (item === null) { d[index] = "" }
          })
          datapay.build({ "data": d }, function(err, tx) {
            var s = tx.outputs[0]._script.toASM();
            o.button.outputs = [{ script: s, amount: 0, currency: 'BSV' }];
            if (o.button && o.button.$pay && o.button.$pay.to) {
              o.button.$pay.to.forEach(function(receiver) {
                o.button.outputs.push({ to: receiver.address, amount: receiver.value/100000000, currency: 'BSV' })
              })
            }
            delete o.button.$el;
            delete o.button.$pay;
            moneyButton.render(buttonEl, o.button)
          })
        })
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } else if (o.data) {
      datapay.build({ "data": o.data }, function(err, tx) {
        var s = tx.outputs[0]._script.toASM();
        var el = o.button.$el;
        var config = o.button;
        config.outputs = [{ script: s, amount: 0, currency: 'BSV' }];
        if (o.button && o.button.$pay && o.button.$pay.to) {
          o.button.$pay.to.forEach(function(receiver) {
            config.outputs.push({ to: receiver.address, amount: receiver.value/100000000, currency: 'BSV' })
          })
        }
        delete config.$el;
        delete config.$pay;
        moneyButton.render(
          (el instanceof Element ? el : document.querySelector(el)),
          config
        )
      })
    }
  }
}

window.databuttonMB = databuttonMB