import { mount } from '@vue/test-utils'
import SearchBar from '../../src/components/SearchBar.vue'

describe('SearchBar.vue', () => {
    it('uses the `query` prop as the input value', () => {
        const wrapper = mount(SearchBar, { props: { query: 'hello world' } })
        const input = wrapper.get('input')
        expect((input.element as HTMLInputElement).value).toBe('hello world')
    })

    it('emits "update:query" with the new value when the user types', async () => {
        const wrapper = mount(SearchBar, { props: { query: '' } })
        const input = wrapper.get('input')
        await input.setValue('new search')
        expect(wrapper.emitted('update:query')).toBeTruthy()
        expect(wrapper.emitted('update:query')![0]).toEqual(['new search'])
    })
})
