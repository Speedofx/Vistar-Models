migrate((app) => {
  for (const name of ['client_enquiries', 'partner_applications']) {
    let existing;
    try { existing = app.findCollectionByNameOrId(name); } catch (_) { existing = null; }
    if (!existing) {
      const collection = new Collection({
        name, type: 'base', listRule: null, viewRule: null,
        createRule: "consent = true && (@request.body.website_check:isset = false || @request.body.website_check = '')",
        updateRule: null, deleteRule: null,
        fields: [
          {name:'name',type:'text',required:true,max:500},
          {name:'company',type:'text',max:500},
          {name:'email',type:'email',required:true},
          {name:'phone',type:'text',required:true,max:20,pattern:'^\\+?[0-9 ()-]{7,20}$'},
          {name:'location',type:'text',required:true,max:500},
          {name:'description',type:'text',required:true,max:5000},
          {name:'details',type:'json',maxSize:20000},
          {name:'consent',type:'bool'},
          {name:'website_check',type:'text',max:0},
          {name:'attachments',type:'file',maxSelect:3,maxSize:5242880,protected:true,mimeTypes:['image/jpeg','image/png','image/webp','application/pdf']},
          {name:'created',type:'autodate',onCreate:true,onUpdate:false},
          {name:'updated',type:'autodate',onCreate:true,onUpdate:true}
        ]
      });
      app.save(collection);
    }
  }
}, (app) => {
  for (const name of ['client_enquiries','partner_applications']) {
    try { app.delete(app.findCollectionByNameOrId(name)); } catch (_) { }
  }
});
