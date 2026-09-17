const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../4MyFirstExpressAppContinued/12DeletingAContact');

async function fixture(t) {
    const server = createApp().listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
    const base = `http://127.0.0.1:${server.address().port}`;
    return (route, body) => fetch(base + route, body ? {
        method: 'POST', body: new URLSearchParams(body), redirect: 'manual'
    } : {});
}

test('home and assets work when launched from the repository root', async t => {
    const request = await fixture(t);
    assert.equal((await request('/')).status, 200);
    const css = await request('/css/home.css');
    assert.equal(css.status, 200);
    assert.match(css.headers.get('content-type'), /text\/css/);
});
test('valid form creates a contact and redirects to home', async t => {
    const request = await fixture(t);
    const response = await request('/create-contact', { name: 'New person', phone: '1112223333' });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/');
    assert.match(await (await request('/')).text(), /New person/);
});
test('deleting a middle contact preserves every other contact and returns', async t => {
    const request = await fixture(t);
    assert.equal((await request('/delete-contact', { phone: '0987654321' })).status, 303);
    const html = await (await request('/')).text();
    assert.doesNotMatch(html, /SRK/);
    assert.match(html, /Arpan/);
    assert.match(html, /Laraib/);
});
test('GET cannot delete a contact', async t => {
    const request = await fixture(t);
    assert.equal((await request('/delete-contact?phone=0987654321')).status, 404);
    assert.match(await (await request('/')).text(), /SRK/);
});
test('unknown contacts return 404 without changing the list', async t => {
    const request = await fixture(t);
    assert.equal((await request('/delete-contact', { phone: '9999999999' })).status, 404);
    assert.match(await (await request('/')).text(), /Laraib/);
});
test('invalid and duplicate submissions are rejected', async t => {
    const request = await fixture(t);
    assert.equal((await request('/create-contact', { name: ' ', phone: '123' })).status, 400);
    assert.equal((await request('/create-contact', { name: 'A', phone: '<script>' })).status, 400);
    assert.equal((await request('/create-contact', { name: 'A', phone: '1234567890' })).status, 409);
});
test('names are escaped in the rendered page', async t => {
    const request = await fixture(t);
    assert.equal((await request('/create-contact', { name: '<script>alert(1)</script>', phone: '123123' })).status, 303);
    const html = await (await request('/')).text();
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
});

test('phones require 3 to 15 digits; rejected input does not alter the list', async t => {
    const request = await fixture(t);
    const before = await (await request('/')).text();
    for (const phone of ['   ', '---', '+ --', '12', '1'.repeat(16)]) {
        assert.equal((await request('/create-contact', { name: 'Invalid', phone })).status, 400);
        assert.equal(await (await request('/')).text(), before);
    }
    assert.equal((await request('/create-contact', { name: 'Formatted', phone: ' +44 123-456 ' })).status, 303);
    assert.match(await (await request('/')).text(), /\+44 123-456/);
});
