import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BpmnModeler from '../BpmnModeler.vue'

describe('BpmnModeler', () => {
  it('renders properly', () => {
    const wrapper = mount(BpmnModeler, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
