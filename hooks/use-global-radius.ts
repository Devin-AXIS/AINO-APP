'use client'

import { useCallback, useMemo, useEffect, useRef } from 'react'
import { useDesignTokens } from '@/components/providers/design-tokens-provider'
import type { GlobalRadiusTokens } from '@/types'

export function useGlobalRadius() {
  const { tokens, updateTokens } = useDesignTokens()
  const initialRadiusCaptured = useRef(false)
  const initialRadiusValues = useRef<{
    card: string
    button: string
    input: string
    modal: string
  } | null>(null)

  // 获取页面上组件的实际边角值
  const getActualRadius = useCallback((componentType: 'card' | 'button' | 'input' | 'modal') => {
    // 查找页面上实际的组件边角值
    let selector = ''
    switch (componentType) {
      case 'card':
        selector = '[class*="card"], [class*="Card"], .card, .Card'
        break
      case 'button':
        selector = 'button, .btn, [class*="button"], [class*="Button"]'
        break
      case 'input':
        selector = 'input, textarea, select, [class*="input"], [class*="Input"]'
        break
      case 'modal':
        selector = '[class*="modal"], [class*="Modal"]'
        break
    }
    
    const elements = document.querySelectorAll(selector)
    
    if (elements.length > 0) {
      const firstElement = elements[0] as HTMLElement
      const computedStyle = window.getComputedStyle(firstElement)
      const borderRadius = computedStyle.borderRadius
      
      console.log(`🔍 检测到 ${componentType} 组件的实际边角值:`, borderRadius)
      
      // 将实际的 CSS 值转换为预设值
      if (borderRadius === '0px' || borderRadius === '0') return 'none'
      if (borderRadius === '2px' || borderRadius === '0.125rem') return 'sm'
      if (borderRadius === '6px' || borderRadius === '0.375rem') return 'md'
      if (borderRadius === '8px' || borderRadius === '0.5rem') return 'lg'
      if (borderRadius === '12px' || borderRadius === '0.75rem') return 'xl'
      if (borderRadius === '9999px') return 'full'
      
      // 如果无法识别，返回 md 作为默认值
      return 'md'
    }
    
    // 如果没有找到组件，返回 md 作为默认值
    return 'md'
  }, [])

  // 捕获并保存初始边角状态
  const captureInitialRadius = useCallback(() => {
    if (initialRadiusCaptured.current) return
    
    console.log('🎯 开始捕获初始边角状态...')
    
    // 获取所有组件的实际边角值
    const cardRadius = getActualRadius('card')
    const buttonRadius = getActualRadius('button')
    const inputRadius = getActualRadius('input')
    const modalRadius = getActualRadius('modal')
    
    // 保存初始值
    initialRadiusValues.current = {
      card: cardRadius,
      button: buttonRadius,
      input: inputRadius,
      modal: modalRadius
    }
    
    console.log('🎯 已捕获初始边角状态:', initialRadiusValues.current)
    
    // 更新"默认"预设为实际的初始状态
    if (tokens?.globalRadius) {
      const newTokens = {
        ...tokens,
        globalRadius: {
          ...tokens.globalRadius,
          presets: {
            ...tokens.globalRadius.presets,
            default: {
              name: "默认",
              description: "页面刷新后的真实初始状态",
              values: {
                card: cardRadius,
                button: buttonRadius,
                input: inputRadius,
                modal: modalRadius
              }
            }
          }
        }
      }
      
      updateTokens(newTokens)
      console.log('✅ 已更新"默认"预设为真实初始状态')
    }
    
    initialRadiusCaptured.current = true
  }, [tokens, updateTokens, getActualRadius])

  // 页面加载时捕获初始状态
  useEffect(() => {
    const captureInitial = () => {
      // 延迟捕获，确保页面完全加载
      setTimeout(() => {
        captureInitialRadius()
      }, 1500)
    }
    
    if (document.readyState === 'complete') {
      captureInitial()
    } else {
      window.addEventListener('load', captureInitial)
      return () => window.removeEventListener('load', captureInitial)
    }
  }, [captureInitialRadius])

  // 获取当前激活的边角预设
  const activePreset = useMemo(() => {
    if (!tokens?.globalRadius) return 'default'
    return tokens.globalRadius.active
  }, [tokens?.globalRadius])

  // 获取特定组件的边角值
  const getComponentRadius = useCallback((componentType: 'card' | 'button' | 'input' | 'modal') => {
    if (!tokens?.globalRadius) {
      // 如果没有配置，使用初始值或默认值
      if (initialRadiusValues.current) {
        const initialValue = initialRadiusValues.current[componentType]
        return tokens?.radius?.[initialValue as keyof typeof tokens.radius] || '0.375rem'
      }
      return tokens?.radius?.md || '0.375rem'
    }
    
    const activePreset = tokens.globalRadius.active
    const preset = tokens.globalRadius.presets[activePreset]
    
    if (!preset) {
      // 如果预设不存在，使用初始值或默认值
      if (initialRadiusValues.current) {
        const initialValue = initialRadiusValues.current[componentType]
        return tokens?.radius?.[initialValue as keyof typeof tokens.radius] || '0.375rem'
      }
      return tokens?.radius?.md || '0.375rem'
    }
    
    const radiusKey = preset.values[componentType]
    const radiusValue = tokens?.radius?.[radiusKey as keyof typeof tokens.radius]
    
    // 如果边角值不存在，使用初始值或默认值
    if (!radiusValue && initialRadiusValues.current) {
      const initialValue = initialRadiusValues.current[componentType]
      return tokens?.radius?.[initialValue as keyof typeof tokens.radius] || '0.375rem'
    }
    
    return radiusValue || tokens?.radius?.md || '0.375rem'
  }, [tokens, initialRadiusValues])

  // 切换边角预设
  const setActivePreset = useCallback((presetKey: string) => {
    if (!tokens?.globalRadius) return
    
    console.log(`🔄 切换到预设: ${presetKey}`)
    
    const newTokens = {
      ...tokens,
      globalRadius: {
        ...tokens.globalRadius,
        active: presetKey
      }
    }
    
    updateTokens(newTokens)
    
    // 如果是切换到"默认"预设，确保使用正确的初始值
    if (presetKey === 'default' && initialRadiusValues.current) {
      console.log('🎯 切换到"默认"预设，使用初始值:', initialRadiusValues.current)
    }
  }, [tokens, updateTokens, initialRadiusValues])

  // 手动更新"默认"预设为当前状态
  const updateDefaultPreset = useCallback(() => {
    if (!tokens?.globalRadius) return
    
    const currentCardRadius = getActualRadius('card')
    const currentButtonRadius = getActualRadius('button')
    const currentInputRadius = getActualRadius('input')
    const currentModalRadius = getActualRadius('modal')
    
    const newTokens = {
      ...tokens,
      globalRadius: {
        ...tokens.globalRadius,
        presets: {
          ...tokens.globalRadius.presets,
          default: {
            name: "默认",
            description: "当前页面的实际状态",
            values: {
              card: currentCardRadius,
              button: currentButtonRadius,
              input: currentInputRadius,
              modal: currentModalRadius
            }
          }
        }
      }
    }
    
    updateTokens(newTokens)
    
    // 更新初始值引用
    initialRadiusValues.current = {
      card: currentCardRadius,
      button: currentButtonRadius,
      input: currentInputRadius,
      modal: currentModalRadius
    }
    
    console.log('✅ 已更新"默认"预设为当前状态:', initialRadiusValues.current)
  }, [tokens, updateTokens, getActualRadius])

  // 生成CSS变量
  const generateRadiusCSSVariables = useCallback(() => {
    if (!tokens?.globalRadius) return ''
    
    let css = ':root {\n'
    
    // 生成全局边角CSS变量
    Object.entries(tokens.globalRadius.presets).forEach(([presetKey, preset]) => {
      Object.entries(preset.values).forEach(([componentType, radiusKey]) => {
        const radiusValue = tokens.radius?.[radiusKey as keyof typeof tokens.radius] || '0.375rem'
        css += `  --radius-${presetKey}-${componentType}: ${radiusValue};\n`
      })
    })
    
    // 生成当前激活预设的CSS变量
    const currentPreset = tokens.globalRadius.presets[tokens.globalRadius.active]
    if (currentPreset) {
      Object.entries(currentPreset.values).forEach(([componentType, radiusKey]) => {
        const radiusValue = tokens.radius?.[radiusKey as keyof typeof tokens.radius] || '0.375rem'
        css += `  --radius-current-${componentType}: ${radiusValue};\n`
      })
    }
    
    css += '}'
    return css
  }, [tokens])

  // 自动应用边角到现有组件
  const applyRadiusToExistingComponents = useCallback(() => {
    if (!tokens?.globalRadius) return
    
    const currentPreset = tokens.globalRadius.presets[tokens.globalRadius.active]
    if (!currentPreset) return
    
    // 获取当前预设的边角值
    const cardRadius = getComponentRadius('card')
    const buttonRadius = getComponentRadius('button')
    const inputRadius = getComponentRadius('input')
    const modalRadius = getComponentRadius('modal')
    
    console.log('🎯 应用边角到组件:', {
      preset: tokens.globalRadius.active,
      card: cardRadius,
      button: buttonRadius,
      input: inputRadius,
      modal: modalRadius
    })
    
    // 创建强制覆盖的 CSS 样式 - 使用更直接的选择器
    const forceOverrideStyles = `
      /* 强制覆盖现有组件的边角样式 - 实时生效 */
      .rounded-sm, .rounded, .rounded-md, .rounded-lg, .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-full {
        border-radius: ${cardRadius} !important;
        transition: border-radius 0.2s ease-in-out;
      }
      
      /* 按钮组件的边角覆盖 */
      button, .btn, [class*="button"] {
        border-radius: ${buttonRadius} !important;
        transition: border-radius 0.2s ease-in-out;
      }
      
      /* 输入框组件的边角覆盖 */
      input, textarea, select {
        border-radius: ${inputRadius} !important;
        transition: border-radius 0.2s ease-in-out;
      }
      
      /* 卡片组件的边角覆盖 */
      [class*="card"], [class*="Card"] {
        border-radius: ${cardRadius} !important;
        transition: border-radius 0.2s ease-in-out;
      }
      
      /* 模态框组件的边角覆盖 */
      [class*="modal"], [class*="Modal"] {
        border-radius: ${modalRadius} !important;
        transition: border-radius 0.2s ease-in-out;
      }
      
      /* 通用边角覆盖 - 覆盖所有使用 Tailwind 边角类的元素 */
      [class*="rounded"] {
        border-radius: ${cardRadius} !important;
        transition: border-radius 0.2s ease-in-out;
      }
    `
    
    // 应用强制覆盖样式
    let forceOverrideTag = document.getElementById('force-radius-override')
    if (!forceOverrideTag) {
      forceOverrideTag = document.createElement('style')
      forceOverrideTag.id = 'force-radius-override'
      document.head.appendChild(forceOverrideTag)
    }
    
    forceOverrideTag.textContent = forceOverrideStyles
    
    // 强制刷新所有相关元素
    const refreshElements = () => {
      // 查找所有可能受影响的元素
      const elements = document.querySelectorAll('.rounded-sm, .rounded, .rounded-md, .rounded-lg, .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-full, button, input, textarea, select, [class*="card"], [class*="Card"], [class*="modal"], [class*="Modal"]')
      
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          // 强制重新计算样式
          el.style.transform = 'translateZ(0)'
          el.offsetHeight // 触发重排
          el.style.transform = ''
        }
      })
    }
    
    // 延迟执行刷新，确保样式已应用
    setTimeout(refreshElements, 50)
    
    // 通知组件边角已更新
    window.dispatchEvent(new CustomEvent('radiusUpdated', {
      detail: {
        card: cardRadius,
        button: buttonRadius,
        input: inputRadius,
        modal: modalRadius
      }
    }))
    
    console.log('🎯 边角强制覆盖已应用:', {
      card: cardRadius,
      button: buttonRadius,
      input: inputRadius,
      modal: modalRadius
    })
  }, [tokens, getComponentRadius])

  // 应用边角预设到DOM
  const applyRadiusToDOM = useCallback(() => {
    if (!tokens?.globalRadius) return
    
    const cssVariables = generateRadiusCSSVariables()
    if (!cssVariables) return
    
    // 创建或更新样式标签
    let styleTag = document.getElementById('global-radius-variables')
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'global-radius-variables'
      document.head.appendChild(styleTag)
    }
    
    styleTag.textContent = cssVariables
    
    // 自动应用边角到现有组件
    applyRadiusToExistingComponents()
  }, [generateRadiusCSSVariables, applyRadiusToExistingComponents, tokens?.globalRadius])

  return {
    activePreset,
    presets: tokens?.globalRadius?.presets || {},
    getComponentRadius,
    setActivePreset,
    generateRadiusCSSVariables,
    applyRadiusToDOM,
    applyRadiusToExistingComponents,
    captureInitialRadius,
    updateDefaultPreset,
    initialRadiusValues: initialRadiusValues.current
  }
}
