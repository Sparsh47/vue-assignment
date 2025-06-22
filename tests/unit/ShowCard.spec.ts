import { mount, RouterLinkStub } from '@vue/test-utils'
import ShowCard from '../../src/components/ShowCard.vue'

describe('ShowCard.vue', () => {
    const baseProps = {
        id: 42,
        imageUrl: 'http://example.com/poster.jpg',
        title: 'My Movie',
        rating: 8,
        isFavorite: false
    }

    it('renders the image and title correctly', () => {
        const wrapper = mount(ShowCard, {
            props: baseProps,
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        const img = wrapper.get('img')
        expect(img.attributes('src')).toBe(baseProps.imageUrl)
        expect(img.attributes('alt')).toBe(baseProps.title)
        expect(wrapper.get('h3').text()).toBe(baseProps.title)
    })

    it('emits "add-fav" with payload when not a favorite', async () => {
        const wrapper = mount(ShowCard, {
            props: { ...baseProps, isFavorite: false },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        const btn = wrapper.get('button')
        expect(btn.attributes('aria-label')).toBe('Add to favorites')

        await btn.trigger('click')
        const events = wrapper.emitted('add-fav')
        expect(events).toHaveLength(1)
        expect(events![0][0]).toEqual({
            id: baseProps.id,
            title: baseProps.title,
            imageUrl: baseProps.imageUrl,
            rating: baseProps.rating
        })
    })

    it('emits "remove-fav" with id when already a favorite', async () => {
        const wrapper = mount(ShowCard, {
            props: { ...baseProps, isFavorite: true },
            global: { stubs: { RouterLink: RouterLinkStub } }
        })
        const btn = wrapper.get('button')
        expect(btn.attributes('aria-label')).toBe('Remove from favorites')

        await btn.trigger('click')
        const events = wrapper.emitted('remove-fav')
        expect(events).toHaveLength(1)
        expect(events![0]).toEqual([baseProps.id])
    })
})
