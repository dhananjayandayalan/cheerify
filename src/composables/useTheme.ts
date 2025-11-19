import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const theme = ref<Theme>('system');

export function useTheme() {
    const applyTheme = (t: Theme) => {
        const root = document.documentElement;
        let effectiveTheme = t;

        if (t === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.setAttribute('data-theme', effectiveTheme);
    };

    const setTheme = (t: Theme) => {
        theme.value = t;
        localStorage.setItem('theme', t);
        applyTheme(t);
    };

    onMounted(() => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
        setTheme(savedTheme);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (theme.value === 'system') {
                applyTheme('system');
            }
        });
    });

    return {
        theme,
        setTheme
    };
}
