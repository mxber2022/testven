// import HeaderMenu from './HeaderMenu'
import DiscordIcon from '@/components/icons/DiscordIcon'
import VeniceSquare from '@/components/icons/VeniceSquare'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import {
  DISCORD_INVITE,
  PROTOCOL_DOCS,
  REGISTER_FEEDBACK,
  RESERVE_BLOG,
  RESERVE_FORUM,
  ROUTES,
} from '@/utils/constants'
import { t } from '@lingui/macro'
import {
  ArrowRight,
  ArrowUpRight,
  Cable,
  Ear,
  Flower,
  Microscope,
  BadgePlus,
  Coins,
  Binoculars,
  LayoutGrid,
} from 'lucide-react'
import { ReactNode, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const DiscoverItem = () => {
  const { pathname } = useLocation()
  const isDTF = pathname.includes('dtf') && !pathname.includes('deploy')

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <NavLink to={ROUTES.HOME}>
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={cn(
                navigationMenuTriggerStyle(),
                (isActive || isDTF) && 'text-primary'
              )}
            >
              <Binoculars strokeWidth={1.5} size={16} />
              <span className="hidden md:block text-base">
                Discover DTFs
              </span>
            </div>
          )}
        </NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const RWAItem = () => {
  const { pathname } = useLocation()
  const isRWA = pathname.includes('rwa')

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <NavLink to="/rwa">
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={cn(
                navigationMenuTriggerStyle(),
                (isActive || isRWA) && 'text-primary'
              )}
            >
              <Coins strokeWidth={1.5} size={16} />
              <span className="hidden md:block text-base">
                RWA
              </span>
            </div>
          )}
        </NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const IconContainer = ({ children }: { children: ReactNode }) => (
  <div className=" p-1 rounded-full border border-foreground">{children}</div>
)

const AppNavigation = () => {
  const { pathname } = useLocation()
  
  // Helper function to check if a route is active (including sub-routes)
  const isRouteActive = (route: string) => {
    if (route === ROUTES.HOME) {
      return pathname === ROUTES.HOME;
    }
    return pathname.startsWith(route);
  };
  
  const [menuItems, moreLinks, externalLinks] = useMemo(
    () => [
      [
        {
          label: 'Lending',
          icon: <Cable strokeWidth={1.5} size={16} />,
          to: ROUTES.LENDING,
        },
        {
          label: 'Create New DTF',
          icon: <BadgePlus strokeWidth={1.5} size={16} />,
          to: ROUTES.DEPLOY_INDEX,
        },
      ],
      [
        {
          label: 'DTF Explorer',
          icon: (
            <IconContainer>
              <Microscope size={16} />
            </IconContainer>
          ),
          description: 'Get an overview of everything going on',
          to: ROUTES.EXPLORER,
        },
        {
          label: 'Venice Bridge',
          icon: (
            <IconContainer>
              <Cable size={16} />
            </IconContainer>
          ),
          description: 'Transfer DTFs across chains',
          to: ROUTES.BRIDGE,
        },
        {
          label: 'Yield DTF Creator',
          icon: (
            <IconContainer>
              <Flower size={16} />
            </IconContainer>
          ),
          description: 'Create a new overcollateralized Yield DTF',
          to: ROUTES.DEPLOY_YIELD,
        },
      ],
      [
        {
          label: 'Feedback',
          icon: <Ear color="#5F5DF9" />,
          description: 'File issues or upvote existing ones',
          to: REGISTER_FEEDBACK,
        },
        {
          label: 'Venice Blog',
          icon: <VeniceSquare />,
          description: 'Stay up to date in long form',
          to: RESERVE_BLOG,
        },
        {
          label: 'Venice Docs',
          icon: <VeniceSquare />,
          description: 'Understand the project and protocols',
          to: PROTOCOL_DOCS,
        },
        {
          label: 'Venice Forum',
          icon: <VeniceSquare />,
          description: 'Discussions of ecosystem ideas',
          to: RESERVE_FORUM,
        },
        {
          label: 'Venice Discord',
          icon: <DiscordIcon color="#5865F2" width={20} />,
          description: 'Join the conversation or ask questions',
          to: DISCORD_INVITE,
        },
      ],
    ],
    []
  )

  return (
    <NavigationMenu
      className="mr-auto border md:border-none rounded-3xl"
      vClassName="-left-10 md:left-40"
    >
      <NavigationMenuList>
        <DiscoverItem />
        <RWAItem />
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.to}>
            <NavigationMenuLink asChild>
              <NavLink to={item.to}>
                {({ isActive }: { isActive: boolean }) => (
                  <div
                    className={cn(
                      navigationMenuTriggerStyle(),
                      (isActive || isRouteActive(item.to.toString())) && 'text-primary'
                    )}
                  >
                    {item.icon}
                    <span className="hidden md:block text-base">
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default AppNavigation
