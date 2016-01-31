import { test } from 'qunit';
import { fixture, moduleFor } from '../test-helper';
import { create, isVisible } from '../../page-object';

moduleFor('.isVisible');

test('returns true when the element is visible', function(assert) {
  fixture('Lorem <span>ipsum</span>');

  let page = create({
    foo: isVisible('span')
  });

  assert.ok(page.foo);
});

test('returns false when the element is hidden', function(assert) {
  fixture('Lorem <span style="display:none">ipsum</span>');

  let page = create({
    foo: isVisible('span')
  });

  assert.ok(!page.foo);
});

test('returns false when the element doesn\'t exist', function(assert) {
  let page = create({
    foo: isVisible('span')
  });

  assert.ok(!page.foo);
});

test('looks for elements inside the scope', function(assert) {
  fixture(`
    <div><span style="display:none">lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
  `);

  let page = create({
    foo: isVisible('span', { scope: '.scope', at: 0 })
  });

  assert.ok(page.foo);
});

test("looks for elements inside page's scope", function(assert) {
  fixture(`
    <div><span style="display:none">lorem</span></div>
    <div class="scope"><span>ipsum</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: isVisible('span', { at: 0 })
  });

  assert.ok(page.foo);
});

test('resets scope', function(assert) {
  fixture(`
    <div><span>lorem</span></div>
    <div class="scope"><span style="display:none">ipsum</span></div>
  `);

  let page = create({
    scope: '.scope',

    foo: isVisible('span', { resetScope: true, at: 0 })
  });

  assert.ok(page.foo);
});

test('throws error if selector matches more than one element', function(assert) {
  fixture(`
    <span>lorem</span>
    <span> ipsum </span>
    <span>dolor</span>
  `);

  let page = create({
    foo: isVisible('span')
  });

  assert.throws(
    () => page.foo,
    /span matched more than one element. If this is not an error use { multiple: true }/
  );
});

test('matches multiple elements with multiple: true option', function(assert) {
  fixture(`
    <span>lorem</span>
    <span style="display:none"> ipsum </span>
    <span>dolor</span>
  `);

  let page = create({
    foo: isVisible('span', { multiple: true })
  });

  assert.ok(page.foo);
});

test('finds element by index', function(assert) {
  fixture(`
    <em style="display:none">lorem</em>
    <em style="display:none">ipsum</em>
    <em>dolor</em>
  `);

  let page = create({
    foo: isVisible('em', { at: 0 }),
    bar: isVisible('em', { at: 2 })
  });

  assert.ok(!page.foo);
  assert.ok(page.bar);
});
