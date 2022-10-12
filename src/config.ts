import cosmiconfig from 'cosmiconfig';

const explorer = cosmiconfig('ast');

type ASTConfig = {
  blackListJsxAttributeName: string[],
  blackListCallExpressionCalle: string[],
}

const defaultConfig: ASTConfig = {
  blackListJsxAttributeName: [
    'type',
    'id',
    'name',
    'children',
    'labelKey',
    'valueKey',
    'labelValue',
    'className',
    'color',
    'key',
    'size',
    'charSet',
    'content',
    'data-testid',
    'path',
    'columnClassName',
    'scrollerClassName',
    'inputClassName',
    'buttonClassName',
    'iconClassName',
    'activeClassName',
    'buttonWrapperClassName',
    'confirmButtonClassName',
    'wrapperClassName',
    'contentClassName',
    'btnClassName',
    'tabIndex',
    'icon',
    'role',
    'type',
    'from',
    'titleIcon',
    'iconRight',
    'to',
    'tag',
    'autoComplete',
    'aria-label',
    'htmlFor',
    'avatarSize',
    'creationType',
    'idPrefix',
    'data-qa',
    'aria-hidden',
    'fallback',
    'variant',
    'defaultValue',
    'searchTermStorageKey',
    'rightButtonLink',
    'leftButtonLink',
    'buttonClass',
    'wrapper',
    'dropzoneClassName',
    'addEntities',
    'reactStringReplace',
    'buttonIcon',
    'buttonIconSize',
    'component',
    'position',
    'layout',
    'align',
    'verticalAlign',
    'target',
    'tabClassName',
    'dataKey',
    'min',
    'nodeId',
    'backgroundColor',
    'nodeAutoColorBy',
    'linkCurvature'
  ],
  blackListCallExpressionCalle: [
    't',
    '_interopRequireDefault',
    'require',
    'routeTo',
    'format',
    'importScripts',
    'buildPath',
    'createLoadable',
    'import',
    'setFieldValue',
    'classnames',
    'classNames',
    '_classnames',
    'bem',
    '_extends', // look into this
    'getDomainRegex',
    'getDomain',
    'orderBy',
    'get',
    'removeKeysWithPrefix',
    'setAttribute',
    'routeParam',
    'onChange',
    'setAttribute',
    'searchResultsSelector',
    'createEntitiesSelector',
    'useSearchParams',
    'useResponsive',
    'searchResultsReducer',
    'createSearchKey',
    'onChange',
    'fetchMySubscribedSpaces',
    'useCallback',
    'createSearchString',
    'paramString',
    'uniqBy',
    'xorBy',
    'includes',
    'handleRemoveType',
    'handleAddType',
    'showToast',
    'bemClassnames',
    'keyBy',
    'addQueryParam',
    'mapValues',
    'truncate',
    'differenceBy',
    // 'pluralise', // todo: check how to approach this, convert to i18n plural. exclude for now
    'fetchUserProfiles',
    'getSearchKey',
    'dateFormat',
    'groupBy',
    'fetchFeed',
    'createAction',
    'getTotal',
    'sumBy',
    'setData',
    'handleChangeData',
    'hasPassed'
  ],
};

let config: ASTConfig | null = null;

export const getAstConfig = (): ASTConfig => {
  if (config) {
    return config;
  }

  const result = explorer.searchSync();

  if (result) {
    config = {
      ...defaultConfig,
      ...result.config,
    };

    return config;
  }

  config = defaultConfig;

  return config;
};
