<template>
    <div class="field">
        <label class="label">{{ label }}</label>
        <div ref="editor"></div>
    </div>
</template>
<script>

    export default {
        props: {
            value: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: null
            },
            placeholder: {
                type: String,
                default: null
            }
        }, 
        data() {
            return {
                editor: null
            };
        },
        mounted() {
            this.editor = new Quill(this.$refs.editor, {
                modules: {
                    toolbar: [
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline',{ 'color': [] }]
                    ]
                },
                placeholder: this.placeholder,
                theme: 'snow',
                formats: ['bold', 'underline', 'size', 'italic', 'color']
            });

            this.editor.root.innerHTML = this.value;
            
            this.editor.on('text-change', () => this.update());
        },

        methods: {
            update() {
                this.$emit('input', this.editor.getText() ? this.editor.root.innerHTML : '');
            }
        }
    }
</script>