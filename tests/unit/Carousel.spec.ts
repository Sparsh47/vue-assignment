import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Carousel from '../../src/components/Carousel.vue'

type Slide = {
    id: number
    title: string
    summary: string
    genre: string[]
    rating: number
    url: string
}

describe('Carousel.vue', () => {
    const slides: Slide[] = [
        { id: 1, title: 'One',   summary: '', genre: [], rating: 1, url: 'one.jpg' },
        { id: 2, title: 'Two',   summary: '', genre: [], rating: 2, url: 'two.jpg' },
        { id: 3, title: 'Three', summary: '', genre: [], rating: 3, url: 'three.jpg' },
        { id: 4, title: 'Four',  summary: '', genre: [], rating: 4, url: 'four.jpg' }
    ]
    let wrapper: ReturnType<typeof mount>

    beforeEach(() => {
        wrapper = mount(Carousel, {
            props: { slides },
            global: {
                stubs: {
                    RouterLink: true,
                    ChevronLeftIcon: true,
                    ChevronRightIcon: true
                }
            }
        })
    })

    it('renders one slide per item', () => {
        const slideEls = wrapper.findAll('div.w-full.flex-shrink-0.relative')
        expect(slideEls).toHaveLength(slides.length)
    })

    it('advances to the next slide when the next button is clicked', async () => {
        const buttons = wrapper.findAll('button')
        const nextBtn = buttons[1]
        await nextBtn.trigger('click')
        await nextTick()

        const track = wrapper.get('div.flex.transition-transform')
        expect(track.attributes('style')).toMatch(/translateX\(-100%\)/)
    })

    it('wraps around to the last slide when prev is clicked on the first slide', async () => {
        const buttons = wrapper.findAll('button')
        const prevBtn = buttons[0]
        await prevBtn.trigger('click')
        await nextTick()

        const track = wrapper.get('div.flex.transition-transform')
        expect(track.attributes('style')).toMatch(/translateX\(-300%\)/)
    })
})
