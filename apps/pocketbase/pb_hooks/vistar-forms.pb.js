onRecordCreateRequest((e) => {
  const email = e.record.getString('email').trim().toLowerCase();
  e.record.set('email', email);
  if (e.record.getString('website_check') || !e.record.getBool('consent')) throw new BadRequestError('Please provide consent and leave the anti-spam field empty.');
  const cutoff = new Date(Date.now() - 60000).toISOString();
  const recent = $app.findRecordsByFilter(e.record.collection().name, 'email = {:email} && created > {:cutoff}', '-created', 1, 0, {email:email,cutoff:cutoff});
  if (recent.length) throw new BadRequestError('Please wait a minute before submitting again.');
  e.next();
}, 'client_enquiries', 'partner_applications');
onRecordAfterCreateSuccess((e) => {
  const escape = (value) => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const partner = e.record.collection().name === 'partner_applications';
  const details = JSON.parse(e.record.getString('details') || '{}');
  const html = '<h1>' + (partner ? 'New partner application' : 'New client enquiry') + '</h1>' + ['name','company','email','phone','location','description'].map(key => '<p><strong>' + key + ':</strong> ' + escape(e.record.getString(key)) + '</p>').join('') + Object.keys(details).map(key => '<p><strong>' + escape(key) + ':</strong> ' + escape(details[key]) + '</p>').join('') + '<p>Reference: ' + escape(e.record.id) + '. Protected attachments are available in the website Data tab.</p>';
  try {
    $app.newMailClient().send(new MailerMessage({from:{name:'Vistar Models'},to:[{address:'vistarmodels@gmail.com'}],subject:partner?'Vistar Models — partner application':'Vistar Models — client requirement',html:html}));
  } catch (err) { $app.logger().error('Vistar form notification failed','error',String(err),'record',e.record.id); }
  e.next();
}, 'client_enquiries', 'partner_applications');
